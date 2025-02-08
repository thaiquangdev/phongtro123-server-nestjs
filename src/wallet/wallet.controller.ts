import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { RechargeDto } from './dto/recharge.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('recharge-zalopay')
  async rechargeZalopay(
    @Body() rechargeDto: RechargeDto,
    @Req() request: Request,
  ) {
    const { id } = request['user'];
    return this.walletService.rechargeZalopay(id, rechargeDto.amount);
  }

  @Post('callback-zalopay')
  async callbackZalopay(@Body() body: any) {
    return await this.walletService.callbackZalopay(body);
  }

  @Get('/check-transaction/:tid')
  async checkTransaction(@Param('tid') tid: string) {
    return await this.walletService.checkTransactionStatus(tid);
  }
}
