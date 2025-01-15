import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

// @Schema()
// class Image {
//   @Prop({ required: true })
//   imageUrl: string;

//   @Prop({ required: false })
//   imageId: string;
// }

// const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  acreage: number;

  @Prop({ required: true, type: [String] })
  highlights: string[];

  @Prop({ required: true })
  address: string;

  @Prop({ required: false, default: false })
  paymentStatus: boolean;

  @Prop({ required: false, default: false })
  confirm: boolean;

  @Prop({ required: true })
  images: string[];

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
