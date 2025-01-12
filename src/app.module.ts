import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    // Load các biến môi trường từ file .env
    ConfigModule.forRoot({
      envFilePath: '.env', // Đường dẫn tới file .env
      isGlobal: true, // Biến môi trường khả dụng trên toàn ứng dụng
    }),

    // Kết nối với MongoDB
    MongooseModule.forRoot(process.env.DB_URL),

    UserModule,

    AuthModule,

    MailModule,

    CategoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
