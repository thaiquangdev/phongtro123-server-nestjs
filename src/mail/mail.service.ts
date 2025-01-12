import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com', // Email người gửi
      to: email, // Email người nhận
      subject: 'Mã xác thực OTP của bạn',
      text: `Mã OTP của bạn là: ${otp}`,
      html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>`, // HTML định dạng email
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendMailForgotPassword(email: string, token: string): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com', // Email người gửi
      to: email, // Email người nhận
      subject: 'Quên mật khẩu',
      html: `<p>Mã token của bạn là: ${token}</p>`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
