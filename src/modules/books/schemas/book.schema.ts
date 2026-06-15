import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export enum PublishStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
}
@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  details: string;

  @Prop({ type: [String], default: [] }) 
  specialFeatures: string[];

  @Prop({ required: true }) 
  bookCover: string;

  @Prop({ required: true }) 
  samplePdf: string;

  @Prop({ type: String, enum: PublishStatus, default: PublishStatus.DRAFT })
  publishStatus: PublishStatus;
}

export const BookSchema = SchemaFactory.createForClass(Book);