import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'src/post/schemas/post.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({
    required: true,
    enum: ['Chưa giải quyết', 'Giải quyết', 'Từ chối'],
    default: 'Chưa giải quyết',
  })
  status: string; // Trạng thái báo cáo

  @Prop({ required: true })
  reason: string; // Mô tả chi tiết báo cáo

  @Prop({ required: false })
  resolvedAt: Date; // Thời gian giải quyết báo cáo

  @Prop({ required: false })
  actionTaken: string; // Hành động đã thực hiện khi xử lý báo cáo
}

export const ReportSchema = SchemaFactory.createForClass(Report);
