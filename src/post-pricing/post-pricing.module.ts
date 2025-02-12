import { Module } from '@nestjs/common';
import { PostPricingController } from './post-pricing.controller';
import { PostPricingService } from './post-pricing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostPricing, PostPricingSchema } from './schemas/post-pricing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostPricing.name, schema: PostPricingSchema },
    ]),
  ],
  controllers: [PostPricingController],
  providers: [PostPricingService],
})
export class PostPricingModule {}
