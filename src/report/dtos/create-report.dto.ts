import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mã bài viết không được để trống' })
  postId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Lý do báo cáo không được để trống' })
  reason: string;
}
