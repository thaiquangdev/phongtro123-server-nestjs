import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(30, { message: 'Tiêu đề tối thiểu 30 ký tự' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @MinLength(30, { message: 'Mô tả tối thiểu 50 ký tự' })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Loại chuyên mục không được để trống' })
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Giá cho thuê không được để trống' })
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Diện tích không được để trống' })
  acreage: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: 'Đặc điểm nổi bật không được để trống' })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  highlights: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;
}
