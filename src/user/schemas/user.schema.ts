import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/common/utils/enums/role.enum';

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

  @Prop({ required: true, enum: Role })
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
