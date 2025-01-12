import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getInfo(@Req() request: Request): Promise<User> {
    const { id } = request['user'];
    return this.userService.getInfo(id);
  }
}
