import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './schemas/book.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; 
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}