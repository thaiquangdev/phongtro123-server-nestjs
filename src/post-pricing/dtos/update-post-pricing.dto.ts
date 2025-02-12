import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdatePostPricingDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumber()
  priceDay: number;

  @ApiProperty()
  @IsNumber()
  priceWeek: number;

  @ApiProperty()
  @IsNumber()
  priceMonth: number;

  @ApiProperty()
  @IsNumber()
  priceNew: number;

  @ApiProperty()
  @IsString()
  colorTitle: string;

  @ApiProperty()
  @IsString()
  postSize: string;

  @ApiProperty()
  @IsBoolean()
  autoBrowse: boolean;

  @ApiProperty()
  @IsBoolean()
  showButtonCall: boolean;

  @ApiProperty()
  @IsNumber()
  vipLevel: number;
}
