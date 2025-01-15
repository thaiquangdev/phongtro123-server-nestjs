import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/utils/enums/role.enum';
import { storageConfig } from 'src/common/utils/helpers/config';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Request } from 'express';
import { UpdatePostDto } from './dtos/update-post.dto';
import { FilterPostDto } from './dtos/filter-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @Post('create-post')
  @Roles(Role.ADMIN, Role.LANDORD)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FilesInterceptor('image-posts', 20, {
      storage: storageConfig('image-posts'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Lỗi khi upload ảnh, ảnh chỉ hỗ trợ upload với các đuôi ${allowedExtArr.join(', ')}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidationError = `Lỗi khi upload hình ảnh, ảnh chỉ hỗ trợ upload với ảnh dưới 10MB`;
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async createPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @Req() request: Request,
  ) {
    const imageUrls = files.map(
      (file: { fieldname: string; filename: string }) =>
        file.fieldname + '/' + file.filename,
    );

    const { id } = request['user'];
    return this.postService.createPost(createPostDto, imageUrls, id);
  }

  @Get('/get-posts')
  async getPosts(@Query() filterPostDto: FilterPostDto) {
    return this.postService.getPosts(filterPostDto);
  }

  @Get('/get-post/:slug')
  async getPost(@Param('slug') slug: string) {
    return this.postService.getPost(slug);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.LANDORD)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('/delete-post/:slug')
  async deletePost(@Param('slug') slug: string) {
    return this.postService.deletePost(slug);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.LANDORD)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('/update-post/:slug')
  @UseInterceptors(
    FilesInterceptor('image-posts', 20, {
      storage: storageConfig('image-posts'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Lỗi khi upload ảnh, ảnh chỉ hỗ trợ upload với các đuôi ${allowedExtArr.join(', ')}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidationError = `Lỗi khi upload hình ảnh, ảnh chỉ hỗ trợ upload với ảnh dưới 10MB`;
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async updatePost(
    @Param('slug') slug: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = files.map(
      (file: { fieldname: string; filename: string }) =>
        file.fieldname + '/' + file.filename,
    );
    return this.postService.updatePost(slug, updatePostDto, imageUrls);
  }
}
