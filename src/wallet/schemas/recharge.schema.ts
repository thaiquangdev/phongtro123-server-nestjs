import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({ timestamps: true })
export class Recharge {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  paymentDate: Date;

  @Prop({ required: false })
  note: string;
}

export const RechargeSchema = SchemaFactory.createForClass(Recharge);
