import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString({ message: 'Email là một chuỗi ký tự' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Mật khẩu là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải 6 ký tự' })
  password: string;

  @ApiProperty()
  @IsString({ message: 'Họ và tên là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MinLength(6, { message: 'Họ và tên tối thiểu phải 6 ký tự' })
  fullName: string;

  @ApiProperty()
  @IsString({ message: 'Số điện thoại là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^\d{10}$/, { message: 'Số điện thoại phải bao gồm 10 chữ số' })
  phoneNumber: string;

  @ApiProperty()
  @IsString({ message: 'Loại tài khoản là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Loại tài khoản không được để trống' })
  role: string;
}
