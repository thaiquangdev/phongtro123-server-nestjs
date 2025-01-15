import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(30, { message: 'Tiêu đề tối thiểu 30 ký tự' })
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(30, { message: 'Mô tả tối thiểu 50 ký tự' })
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  price: number;

  @ApiProperty()
  @IsString()
  acreage: number;

  @ApiProperty()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  highlights: string[];

  @ApiProperty()
  @IsString()
  address: string;
}
