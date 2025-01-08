import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['Tìm kiếm', 'Môi giới', 'Chính chủ'] })
  role: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: false })
  passwordResetToken: string;

  @Prop({ required: false })
  passwordResetExpires: Date;

  @Prop({ required: false })
  emailVerified: boolean;

  @Prop({ required: false })
  otp: string;

  @Prop({ required: false })
  otpExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
