import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import slugify from 'slugify';
import * as path from 'path';
import * as fs from 'fs';
import { UpdatePostDto } from './dtos/update-post.dto';
import { FilterPostDto } from './dtos/filter-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // tạo mới một post
  async createPost(
    createPostDto: CreatePostDto,
    images: string[],
    userId: string,
  ) {
    const slug = slugify(createPostDto.title);
    // kiểm tra xem bài viết đã tồn tại chưa
    const post = await this.postModel.findOne({ slug });
    if (post) {
      for (const image of images) {
        const filePath = path.join(process.cwd(), 'uploads', image);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Lỗi khi xóa file: ${err.message}`);
          } else {
            console.log(`File ${filePath} đã được xóa`);
          }
        });
      }
      throw new BadRequestException('Bài viết với tiêu đề này đã tồn tại.');
    }

    // tạo mới bài viết
    const newPost = await this.postModel.create({
      title: createPostDto.title,
      slug,
      description: createPostDto.description,
      category: createPostDto.category,
      price: createPostDto.price,
      acreage: createPostDto.acreage,
      highlights: createPostDto.highlights,
      address: createPostDto.address,
      images,
      user: userId,
    });

    await newPost.save();
    return {
      message: 'Tạo mới bài viết thành công',
    };
  }

  // lấy ra danh sách bài viết
  async getPosts(filterPost: FilterPostDto) {
    const limit = filterPost.limit || 10; // Số bài viết mỗi trang
    const page = filterPost.page || 1; // Trang hiện tại
    const skip = (page - 1) * limit; // Số bài viết cần bỏ qua

    // Định nghĩa whereCondition với các bộ lọc hợp lệ
    const whereCondition: {
      category?: string;
      acreage?: number;
      price?: { $gte?: number; $lte?: number };
    } = {};

    // Lọc theo chuyên mục
    if (filterPost.category) {
      whereCondition.category = filterPost.category;
    }

    // Lọc theo diện tích
    if (filterPost.acreage) {
      whereCondition.acreage = filterPost.acreage;
    }

    // Lọc theo giá (minPrice và maxPrice)
    if (filterPost.minPrice || filterPost.maxPrice) {
      whereCondition.price = {};
      if (filterPost.minPrice) {
        whereCondition.price.$gte = filterPost.minPrice; // Giá lớn hơn hoặc bằng minPrice
      }
      if (filterPost.maxPrice) {
        whereCondition.price.$lte = filterPost.maxPrice; // Giá nhỏ hơn hoặc bằng maxPrice
      }
    }

    // Lấy danh sách bài viết từ MongoDB với điều kiện lọc và sắp xếp
    const posts = await this.postModel
      .find(whereCondition) // Áp dụng điều kiện lọc
      .skip(skip) // Bỏ qua số bài viết theo phân trang
      .limit(limit) // Lấy số bài viết theo limit
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất (desc)

    // Tổng số bài viết phù hợp với bộ lọc (nếu cần)
    const total = await this.postModel.countDocuments(whereCondition);

    return {
      posts, // Danh sách bài viết
      total, // Tổng số bài viết phù hợp
      limit, // Số bài viết mỗi trang
      page, // Trang hiện tại
    };
  }

  // lấy ra chi tiết bài viết
  async getPost(slug: string) {
    const post = await this.postModel.findOne({ slug });
    if (!post) {
      throw new BadRequestException('Không tìm thấy bài viết');
    }

    return post;
  }

  // cập nhật bài viết
  async updatePost(
    slug: string,
    updatePostDto: UpdatePostDto,
    images: string[],
  ) {
    const post = await this.postModel.findOne({ slug });
    if (!post) {
      throw new BadRequestException('Không tìm thấy bài viết');
    }

    if (images) {
      for (const image of images) {
        const filePath = path.join(process.cwd(), 'uploads', image);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Lỗi khi xóa file: ${err.message}`);
          } else {
            console.log(`File ${filePath} đã được xóa`);
          }
        });
      }
    }

    post.title = updatePostDto.title || post.title;
    post.description = updatePostDto.description || post.description;
    post.category = updatePostDto.category || post.category;
    post.price = updatePostDto.price || post.price;
    post.acreage = updatePostDto.acreage || post.acreage;
    post.highlights = updatePostDto.highlights || post.highlights;
    post.address = updatePostDto.address || post.address;
    post.images = images || post.images;

    await post.save();

    return {
      message: 'Cập nhật bài viết thành công',
    };
  }

  // xóa bài viết
  async deletePost(slug: string) {
    const post = await this.postModel.findOne({ slug });
    if (!post) {
      throw new BadRequestException('Không tìm thấy bài viết');
    }

    // xóa ảnh ở trong file uploads
    for (const image of post.images) {
      const filePath = path.join(process.cwd(), 'uploads', image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Lỗi khi xóa file: ${err.message}`);
        } else {
          console.log(`File ${filePath} đã được xóa`);
        }
      });
    }

    // xóa bài viết trong db
    await this.postModel.deleteOne({ slug });
    return { message: 'Xóa bài viết thành công' };
  }
}
