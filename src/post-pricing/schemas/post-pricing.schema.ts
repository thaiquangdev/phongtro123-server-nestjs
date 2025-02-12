import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PostPricing extends Document {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ required: true })
  priceDay: number;

  @Prop({ required: true })
  priceWeek: number;

  @Prop({ required: true })
  priceMonth: number;

  @Prop({ required: true })
  priceNew: number;

  @Prop({ required: true })
  colorTitle: string;

  @Prop({ required: true })
  postSize: string;

  @Prop({ required: true })
  autoBrowse: boolean;

  @Prop({ required: true })
  showButtonCall: boolean;

  @Prop({ required: true })
  vipLevel: number;
}

export const PostPricingSchema = SchemaFactory.createForClass(PostPricing);
