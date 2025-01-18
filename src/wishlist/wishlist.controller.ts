import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateWishlistDto } from './dtos/create-wishlist.dto';
import { Request } from 'express';
import { Wishlist } from './schemas/wishlist.schema';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('add-to-wishlist')
  async addToWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.wishlistService.createWishlist(id, createWishlistDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('delete-to-wishlist/:wid')
  async deleteToWishlist(
    @Param('wid') wid: string,
  ): Promise<{ message: string }> {
    return this.wishlistService.deleteWishlist(wid);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('get-wishlists')
  async getWishlists(): Promise<Wishlist[]> {
    return this.wishlistService.getWishlists();
  }
}
