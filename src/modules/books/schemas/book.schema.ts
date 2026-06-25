import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ required: true, trim: true })
  details!: string;

  @Prop({ type: [String], default: [] })
  specialFeatures!: string[];

  @Prop({ required: true })
  bookCover!: string;

  @Prop({ required: true })
  samplePdf!: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);