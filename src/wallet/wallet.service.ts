import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recharge } from './schemas/recharge.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { Wallet } from './schemas/wallet.schema';
import { ZalopayConfig } from 'src/common/utils/helpers/zalopay.config';
import * as qs from 'qs';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Recharge.name) private rechargeModel: Model<Recharge>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  // nạp tiền bằng zalopay
  async rechargeZalopay(userId: number, amount: number) {
    // Kiểm tra amount
    if (amount <= 0) {
      throw new HttpException('Số tiền phải lớn hơn 0', HttpStatus.BAD_REQUEST);
    }

    const transID = Math.floor(Math.random() * 1000000); // Tạo transID ngẫu nhiên
    const embed_data = { redirectUrl: 'https://facebook.com' };
    const items = [{}];
    const orderRequest = {
      app_id: ZalopayConfig.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // ID giao dịch duy nhất
      app_user: `user_${userId}`,
      app_time: Date.now(), // Thời gian tạo giao dịch (miliseconds)
      amount: amount,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      description: `Nạp ${amount} vào tài khoản`,
      mac: '',
      callback_url:
        'https://3c48-116-105-22-102.ngrok-free.app/wallets/callback-zalopay',
    };

    // Tạo chuỗi ký MAC (HMAC SHA256)
    const data = [
      orderRequest.app_id,
      orderRequest.app_trans_id,
      orderRequest.app_user,
      orderRequest.amount,
      orderRequest.app_time,
      orderRequest.embed_data,
      orderRequest.item,
    ].join('|');

    orderRequest.mac = CryptoJS.HmacSHA256(data, ZalopayConfig.key1).toString();
    console.log(orderRequest);
    try {
      // Gửi yêu cầu đến ZaloPay
      const zalopayResponse = await axios.post(ZalopayConfig.endpoint, null, {
        params: orderRequest,
      });
      console.log(zalopayResponse.data);
      // Kiểm tra phản hồi từ ZaloPay
      if (!zalopayResponse.data || zalopayResponse.data.return_code !== 1) {
        throw new HttpException(
          zalopayResponse.data.return_message || 'Giao dịch ZaloPay thất bại',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Lưu giao dịch vào cơ sở dữ liệu
      const newRecharge = await this.rechargeModel.create({
        user: userId,
        amount,
        status: 'Đang chờ', // Giao dịch đang chờ
        transactionId: `${moment().format('YYMMDD')}_${transID}`,
        paymentMethod: 'ZALOPAY',
        paymentDate: new Date(),
      });
      await newRecharge.save();

      return {
        message: 'Vui lòng truy cập vào url để nạp tiền',
        url: zalopayResponse.data.order_url, // URL thanh toán từ ZaloPay
      };
    } catch (error) {
      // Xử lý lỗi
      throw new HttpException(
        error.response?.data?.return_message || 'Lỗi khi tạo giao dịch ZaloPay',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async callbackZalopay(body: any) {
    const result: { return_code: number; return_message: string } = {
      return_code: 0,
      return_message: '',
    };

    try {
      const { data: dataStr, mac: reqMac } = body;
      const mac = CryptoJS.HmacSHA256(dataStr, ZalopayConfig.key2).toString();

      if (reqMac !== mac) {
        console.log('Mac không hợp lệ');
        result.return_code = -1;
        result.return_message = 'MAC không hợp lệ';
        return result;
      }

      const dataJson = JSON.parse(dataStr);
      const transactionId = dataJson['app_trans_id'];
      const recharge = await this.rechargeModel.findOne({ transactionId });

      if (!recharge) {
        result.return_code = 0;
        result.return_message = 'Không tìm thấy đơn hàng';
        return result;
      }

      // ✅ Giao dịch thành công
      recharge.status = 'Thành công';
      await recharge.save();

      // Cập nhật số dư ví
      await this.walletModel.findOneAndUpdate(
        { user: recharge.user },
        { $inc: { balance: recharge.amount } },
        { upsert: true, new: true },
      );
    } catch (error) {
      result.return_code = 0;
      result.return_message = error.message;
    }

    return result;
  }

  async checkTransactionStatus(transactionId: string) {
    const { app_id, key1, endpointQuery } = ZalopayConfig;

    // ✅ Tạo MAC (app_id|app_trans_id|key1)
    const macData = `${app_id}|${transactionId}|${key1}`;
    const mac = CryptoJS.HmacSHA256(macData, key1).toString();

    const postData = {
      app_id,
      app_trans_id: transactionId,
      mac,
    };

    try {
      const response = await axios.post(endpointQuery, qs.stringify(postData), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('✅ Kết quả:', response.data);
      const recharge = await this.rechargeModel.findOne({ transactionId });
      if (!recharge) {
        throw new BadRequestException('Không tìm thấy đơn hàng');
      }

      recharge.status = 'Thất bại';
      recharge.note = response.data.sub_return_message;
      await recharge.save();
      return recharge;
    } catch (error) {
      console.error(
        `❌ Lỗi kiểm tra trạng thái giao dịch ${transactionId}:`,
        error.message,
      );
      return null;
    }
  }

  // truy vấn lịch sử nạp tiền
  async rechargeHistory() {
    const recharges = await this.rechargeModel.find().sort({ createdAt: -1 });
    return {
      recharges,
    };
  }
}
