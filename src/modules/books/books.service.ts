import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  // Helper function to parse special features
  private parseFeatures(specialFeatures: any): string[] {
    if (!specialFeatures) return [];
    try {
      return typeof specialFeatures === 'string' 
        ? JSON.parse(specialFeatures) 
        : specialFeatures;
    } catch {
      return specialFeatures.split(',').map((f: string) => f.trim());
    }
  }

  // 1. Create Book
  async create(bookData: any): Promise<Book> {
    const featuresArray = this.parseFeatures(bookData.specialFeatures);

    const newBook = new this.bookModel({
      ...bookData,
      price: Number(bookData.price),
      specialFeatures: featuresArray,
    });

    return newBook.save();
  }

  // 2. Find All Books
  async findAllBooks(): Promise<Book[]> {
    return this.bookModel.find().sort({ createdAt: -1 }).exec();
  }

  // 3. Find Single Book By ID
  async findBookById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException('এই আইডি দিয়ে কোনো বই খুঁজে পাওয়া যায়নি!');
    }
    return book;
  }

  // 4. Update Book
  async updateBook(id: string, updateData: any): Promise<Book> {
    if (updateData.specialFeatures) {
      updateData.specialFeatures = this.parseFeatures(updateData.specialFeatures);
    }
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updatedBook) {
      throw new NotFoundException('আপডেট করার জন্য কোনো বই খুঁজে পাওয়া যায়নি!');
    }
    return updatedBook;
  }

  // 5. Delete Book
  async deleteBook(id: string): Promise<{ message: string }> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('ডিলিট করার জন্য কোনো বই খুঁজে পাওয়া যায়নি!');
    }
    return { message: 'বইটি সফলভাবে ডিলিট করা হয়েছে।' };
  }
}