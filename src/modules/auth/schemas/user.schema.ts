import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ required: false }) 
  password?: string;

  @Prop({ required: false, default: '' })
  imageUrl?: string;

  @Prop({ required: false, default: '' })
  address?: string;

  @Prop({ type: [String], default: [] }) 
  ipAddresses!: string[];

  @Prop({ required: false, default: 'credentials' })
  provider?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);