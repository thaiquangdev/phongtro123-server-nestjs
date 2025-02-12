import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostPricingService } from './post-pricing.service';
import { CreatePostPricingDto } from './dtos/create-post-pricing.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/utils/enums/role.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { UpdatePostPricingDto } from './dtos/update-post-pricing.dto';
import { PostPricing } from './schemas/post-pricing.schema';

@Controller('post-pricing')
export class PostPricingController {
  constructor(private readonly postPricingService: PostPricingService) {}

  // Endpoint: Tạo mới một giá dịch vụ
  // Method: POST
  // URL: /post-pricing/create-post-pricing
  @Post('/create-post-pricing')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async createPostPricing(
    @Body() createPostPricingDto: CreatePostPricingDto,
  ): Promise<PostPricing> {
    return this.postPricingService.createPostPricing(createPostPricingDto);
  }

  // Endpoint: Cập nhật giá dịch vụ
  // Method: PUT
  // URL: /post-pricing/update-post-pricing/:pid
  @Put('/update-post-pricing/:pid')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async updatePostPricing(
    @Param('pid') pid: string,
    @Body() updatePostPricingDto: UpdatePostPricingDto,
  ): Promise<PostPricing> {
    return this.postPricingService.updatePostPricing(pid, updatePostPricingDto);
  }

  // Endpoint: Xóa giá dịch vụ
  // Method: DELETE
  // URL: /post-pricing/delete-post-pricing/:pid
  @Delete('/update-post-pricing/:pid')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async deletePostPricing(@Param('pid') pid: string): Promise<string> {
    return this.postPricingService.deletePostPricing(pid);
  }

  // Endpoint: Lấy danh sách giá dịch vụ
  // Method: GET
  // URL: /post-pricing/get-post-pricing
  @Get('/get-post-pricing')
  async getPostPricing(): Promise<PostPricing[]> {
    return this.postPricingService.getPostPricing();
  }
}
