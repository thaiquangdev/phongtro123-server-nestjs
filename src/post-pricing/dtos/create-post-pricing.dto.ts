import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostPricingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tên giá dịch vụ không được để trống' })
  type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Giá ngày không được để trống' })
  priceDay: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Giá tuần không được để trống' })
  priceWeek: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Giá tháng không được để trống' })
  priceMonth: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Giá đẩy tin không được để trống' })
  priceNew: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Màu sắc tiêu đề không được để trống' })
  colorTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Khích thước tin không được để trống' })
  postSize: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Tự động duyệt không được để trống' })
  autoBrowse: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Hiển thị nút gọi điện không được để trống' })
  showButtonCall: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'Loại tin không được để trống' })
  vipLevel: number;
}
