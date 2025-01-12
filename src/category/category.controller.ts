import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/utils/enums/role.enum';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './schemas/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('/create-category')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/update-category/:cid')
  async updateCategory(
    @Param('cid') cid: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string }> {
    return this.categoryService.updateCategory(cid, updateCategoryDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-category/:cid')
  async deleteCategory(
    @Param('cid') cid: string,
  ): Promise<{ message: string }> {
    return this.categoryService.deleteCategory(cid);
  }

  @Get('/get-categories')
  async getCategories(): Promise<Category[]> {
    return this.categoryService.getCategories();
  }
}
