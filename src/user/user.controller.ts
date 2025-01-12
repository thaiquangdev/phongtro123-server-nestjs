import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/change-password')
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() email: string): Promise<{ message: string }> {
    return this.userService.forgotPassword(email);
  }

  @Post('/reset-passwrord')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
