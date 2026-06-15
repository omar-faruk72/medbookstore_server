import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, PublishStatus } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async create(bookData: any): Promise<Book> {
    let featuresArray: string[] = [];
    if (bookData.specialFeatures) {
      try {
        featuresArray = typeof bookData.specialFeatures === 'string' 
          ? JSON.parse(bookData.specialFeatures) 
          : bookData.specialFeatures;
      } catch {
        featuresArray = bookData.specialFeatures.split(',').map((f: string) => f.trim());
      }
    }

    const newBook = new this.bookModel({
      ...bookData,
      price: Number(bookData.price),
      specialFeatures: featuresArray,
    });

    return newBook.save();
  }

  async findActiveBooks(): Promise<Book[]> {
    return this.bookModel
      .find({ publishStatus: PublishStatus.ACTIVE })
      .populate('category', 'name') 
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllBooksForAdmin(): Promise<Book[]> {
    return this.bookModel.find().populate('category', 'name').sort({ createdAt: -1 }).exec();
  }
}