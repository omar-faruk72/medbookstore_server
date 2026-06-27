import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfsService } from './pdfs.service';
import { PdfsController } from './pdfs.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; 
import { AuthModule } from '../auth/auth.module'; 
import { Pdf, PdfSchema } from './schema/pdf.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pdf.name, schema: PdfSchema }]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [PdfsController],
  providers: [PdfsService],
})
export class PdfsModule {}