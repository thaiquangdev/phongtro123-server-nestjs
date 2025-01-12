import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty()
  @IsString({ message: 'Email là một chuỗi ký tự' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Mã OTP là mỗi chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  otp: string;
}
