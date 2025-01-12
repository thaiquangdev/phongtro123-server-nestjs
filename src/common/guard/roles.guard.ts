import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles: string[] = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { id } = request['user'];
    if (!id) {
      throw new UnauthorizedException('Bạn cần đăng nhập để truy cập');
    }

    const user = await this.userModel.findById(id).select('role');
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào tài nguyên này',
      );
    }
    return true;
  }
}
