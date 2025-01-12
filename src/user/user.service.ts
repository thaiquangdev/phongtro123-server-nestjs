import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // lấy thông tin chi tiết
  async getInfo(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select('email phoneNumber fullName');
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }
    return user;
  }
}
