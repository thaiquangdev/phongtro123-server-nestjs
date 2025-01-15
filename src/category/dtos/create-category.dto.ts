import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString({ message: 'Tên chuyên mục là một chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên chuyên mục không được để trống' })
  name: string;

  @ApiProperty()
  @IsEmpty()
  description: string;
}
