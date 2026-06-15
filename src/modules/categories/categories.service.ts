import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name } = createCategoryDto;
        const existingCategory = await this.categoryModel.findOne({ name: name.trim() });
    if (existingCategory) {
      throw new BadRequestException('এই ক্যাটাগরিটির নাম ইতিমধ্যে ডাটাবেজে আছে!');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }
}