import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wishlist } from './schemas/wishlist.schema';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { Model } from 'mongoose';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
  ) {}

  // thêm bài viết yêu thích
  async createWishlist(
    userId: string,
    createWishlistDto: CreateWishlistDto,
  ): Promise<{ message: string }> {
    const newWishlist = await this.wishlistModel.create({
      post: createWishlistDto.postId,
      user: userId,
    });
    await newWishlist.save();
    return {
      message: 'Thêm bài viết vào danh sách yêu thích thành công',
    };
  }

  // xóa bài viết yêu thích
  async deleteWishlist(wid: string): Promise<{ message: string }> {
    const wishlist = await this.wishlistModel.deleteOne({ _id: wid });
    if (wishlist.deletedCount === 0) {
      throw new BadRequestException(
        `Không tìm thấy bài viết trong danh sách yêu thích với ${wid}`,
      );
    }
    return {
      message: 'Xóa bài viết trong danh sách yêu thích thành công',
    };
  }

  // lấy ra danh sách bài viết yêu thích
  async getWishlists(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistModel.find();
    return wishlists;
  }
}
