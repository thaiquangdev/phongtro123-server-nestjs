import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ChangePasswordDto } from './dtos/change-password.dto';
import * as bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  // lấy thông tin chi tiết
  async getInfo(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('email phoneNumber fullName');
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    return user;
  }

  // thay đổi mật khẩu
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).select('password');
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    const comparePassword = await bcryptjs.compareSync(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashPassword = await bcryptjs.hashSync(
      changePasswordDto.newPassword,
      12,
    );

    user.password = hashPassword;

    await user.save();

    return {
      message: 'Thay đổi mật khẩu thành công',
    };
  }

  // quên mật khẩu - gửi mail
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Không tìm thấy email ');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = token;
    user.passwordResetExpires = tokenExpire;
    await user.save();

    try {
      await this.mailService.sendMailForgotPassword(email, token);
    } catch (error) {
      console.error('Failed to send email:', error.message);
      throw new HttpException(
        'Failed to send Forgot password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      message: 'Gửi mail thành công. Hãy kiểm tra email của bạn',
    };
  }

  // đặt lại mật khẩu
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { newPassword, token } = resetPasswordDto;

    const user = await this.userModel.findOne({ passwordResetToken: token });

    if (!user) {
      throw new BadRequestException('Token không hợp lệ hoặc hết hạn');
    }

    if (new Date() > user.passwordResetExpires) {
      throw new BadRequestException('Token không hợp lệ hoặc hết hạn');
    }

    const hashPassword = await bcryptjs.hashSync(newPassword, 12);

    user.password = hashPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return {
      message: 'Đặt lại mật khẩu thành công.',
    };
  }
}
