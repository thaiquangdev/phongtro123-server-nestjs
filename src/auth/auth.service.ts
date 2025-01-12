/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dtos/register-dto';
import { MailService } from 'src/mail/mail.service';
import * as bcryptjs from 'bcryptjs';
import { VerifyOtpDto } from './dtos/verify-otp';
import { LoginDto } from './dtos/login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  // đăng ký
  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { fullName, phoneNumber, email, password, role } = registerDto;

    // kiểm tra người dùng đã tồn tại chưa
    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      if (userExist.emailVerified) {
        throw new BadRequestException('Người dùng đã tồn tại');
      } else {
        // tạo mới otp
        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        // lưu vào db
        userExist.otp = otp.toString();
        userExist.otpExpires = otpExpires;

        // send Mail
        try {
          await this.mailService.sendOtp(email, otp.toString());
        } catch (error) {
          console.error('Failed to send email:', error.message);
          throw new HttpException(
            'Failed to send OTP',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return {
          message: 'Gửi OTP thành công, vui lòng kiểm tra email của bạn',
        };
      }
    }

    // tạo mới otp
    const otp = this.generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    const hashPassword = bcryptjs.hashSync(password, 12);

    // tạo mới người dùng
    const newUser = await this.userModel.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
      otp: otp.toString(),
      otpExpires,
      role,
    });

    await newUser.save();

    // send Mail
    try {
      await this.mailService.sendOtp(email, otp.toString());
    } catch (error) {
      console.error('Failed to send email:', error.message);
      throw new HttpException(
        'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Tạo tài khoản thành công. Vui lòng kiểm tra email của bạn',
    };
  }

  // xác nhận otp
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;

    // Tìm người dùng theo email
    const user = await this.userModel
      .findOne({ email })
      .select('otp otpExpires emailVerify');
    if (!user) {
      throw new BadRequestException('Thông tin không chính xác'); // Không tiết lộ thông tin quá chi tiết
    }

    // So sánh OTP
    const now = new Date();
    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Mã otp không chính xác');
    }

    // Kiểm tra OTP đã hết hạn
    if (now > user.otpExpires) {
      throw new BadRequestException('Otp đã hết hạn. hãy thử lại');
    }

    // Xác nhận email
    user.emailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { message: 'Xác nhận OTP thành công' };
  }

  // đăng nhập
  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('-role');

    if (!user || !user.emailVerified) {
      throw new BadRequestException('Email hoặc mật khẩu không chính xác');
    }

    const comparePassword = bcryptjs.compareSync(password, user.password);
    if (!comparePassword) {
      throw new BadRequestException('Email hoặc mậtk hẩu không chính xác');
    }

    // tạo mới token
    const accessToken = await this.generateAccessToken(
      String(user._id),
      user.email,
    );
    const refreshToken = await this.generateRefreshToken(
      String(user._id),
      user.email,
    );

    // lưu refreshToken vào db
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
    };
  }

  // tạo lại token mới từ refresh token
  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const checkExistToken = await this.userModel.findOne({
        email: verify.email,
        refreshToken,
      });
      if (checkExistToken) {
        const accessToken = this.generateAccessToken(
          String(checkExistToken._id),
          checkExistToken.email,
        );
        const refreshToken = this.generateRefreshToken(
          String(checkExistToken._id),
          checkExistToken.email,
        );
        checkExistToken.refreshToken = String(refreshToken);
        await checkExistToken.save();
        return {
          accessToken,
          refreshToken,
        };
      } else {
        throw new BadRequestException('Refreshtoken không hợp lệ');
      }
    } catch (err) {
      throw new HttpException(
        'Refreshtoken không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Hàm tạo mã OTP
  private generateOTP(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // Hạm tạo mới accessToken
  private async generateAccessToken(
    id: string,
    email: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id, email },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    );
  }

  // Hạm tạo mới refreshToken
  private async generateRefreshToken(
    id: string,
    email: string,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      { id, email },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );
  }
}
