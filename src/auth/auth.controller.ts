import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register-dto';
import { LoginDto } from './dtos/login-dto';
import { VerifyOtpDto } from './dtos/verify-otp';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  @Post('/verify-otp')
  async verifyOtp(
    @Body() verifyOtp: VerifyOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyOtp(verifyOtp);
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/logout')
  async logout(@Req() request: Request): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.authService.logout(id);
  }
}
