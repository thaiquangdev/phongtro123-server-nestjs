import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString({ message: 'Tên chuyên mục là một chuỗi ký tự' })
  name: string;

  @ApiProperty()
  description: string;
}
