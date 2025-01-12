import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString({ message: 'Mật khẩu mới là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu mới ít nhất phải 6 ký tự' })
  newPassword: string;

  @ApiProperty()
  @IsString({ message: 'Token mới là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token: string;
}
