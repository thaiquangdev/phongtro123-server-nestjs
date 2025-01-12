import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // tạo mới chuyên mục
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string }> {
    const categoryExist = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExist) {
      throw new BadRequestException('Chuyên mục này đã tồn tại');
    }

    const newCatgegory = await this.categoryModel.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });

    await newCatgegory.save();
    return {
      message: 'Tạo mới chuyên mục thành công',
    };
  }

  // sửa chuyên mục
  async updateCategory(cid: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findById(cid);
    if (!category) {
      throw new BadRequestException('Không tìm thấy chuyên mục');
    }

    category.name = updateCategoryDto.name || category.name;
    category.description =
      updateCategoryDto.description || category.description;

    await category.save();

    return {
      message: 'Cập nhật chuyên mục thành công',
    };
  }

  // lấy ra danh sách chuyên mục
  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find();
    return categories;
  }

  // xóa chuyên mục
  async deleteCategory(cid: string) {
    const result = await this.categoryModel.deleteOne({ _id: cid });
    if (result.deletedCount === 0) {
      throw new BadRequestException('Không tìm thấy chuyên mục để xóa');
    }
    return {
      message: 'Xóa chuyên mục thành công',
    };
  }
}
