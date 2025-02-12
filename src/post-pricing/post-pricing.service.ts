import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostPricing } from './schemas/post-pricing.schema';
import { Model } from 'mongoose';
import { CreatePostPricingDto } from './dtos/create-post-pricing.dto';
import { UpdatePostPricingDto } from './dtos/update-post-pricing.dto';

@Injectable()
export class PostPricingService {
  constructor(
    @InjectModel(PostPricing.name) private postPricingModel: Model<PostPricing>,
  ) {}

  // tạo mới một giá dịch vụ
  async createPostPricing(
    createPostPricingDto: CreatePostPricingDto,
  ): Promise<PostPricing> {
    if (
      await this.postPricingModel.exists({ type: createPostPricingDto.type })
    ) {
      throw new BadRequestException('Giá dịch vụ này đã tồn tại');
    }

    return this.postPricingModel.create(createPostPricingDto);
  }

  // cập nhật một giá dịch vụ
  async updatePostPricing(
    pid: string,
    updatePostPricingDto: UpdatePostPricingDto,
  ): Promise<PostPricing> {
    const updatePostPricing = await this.postPricingModel.findByIdAndUpdate(
      pid,
      updatePostPricingDto,
      { new: true }, // Không dùng upsert để tránh tạo mới không mong muốn
    );

    if (!updatePostPricing) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ');
    }

    return updatePostPricing;
  }

  // xóa giá dịch vụ
  async deletePostPricing(pid: string): Promise<string> {
    const deletePostPricing =
      await this.postPricingModel.findByIdAndDelete(pid);
    if (!deletePostPricing) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ');
    }
    return 'Xóa giá dịch vụ thành công';
  }

  // lấy ra danh sách giá dịch vụ
  async getPostPricing(): Promise<PostPricing[]> {
    return this.postPricingModel.find();
  }
}
