import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({ timestamps: true })
export class Pdf extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ required: true, trim: true })
  details!: string;

  @Prop({ type: [String], default: [] })
  specialFeatures!: string[];

  @Prop({ required: true })
  pdfCover!: string;

  @Prop({ required: true })
  pdf!: string;
}

export const PdfSchema = SchemaFactory.createForClass(Pdf);