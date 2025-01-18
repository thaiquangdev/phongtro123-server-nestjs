import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mã bài viết không được để trống' })
  postId: string;
}
