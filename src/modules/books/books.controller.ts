import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDataDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

// এক্সপ্রেস টাইপ গ্লোবালি না পাইলে NestJS এর নিজস্ব টাইপ ইন্টারফেস ডিফাইন করে নেওয়া সবচেয়ে নিরাপদ
interface UploadedBookFiles {
  bookCover?: any[];
  samplePdf?: any[];
}

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 1. Post API (Admin Only)
  @Post('post')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bookCover', maxCount: 1 }, 
      { name: 'samplePdf', maxCount: 1 }, 
    ]),
  )
  async create(
    @Body() createBookDataDto: CreateBookDataDto,
    @UploadedFiles()
    files: UploadedBookFiles,
  ) {
    if (!files || !files.bookCover || !files.samplePdf) {
      throw new BadRequestException('বইয়ের কভার ইমেজ এবং স্যাম্পল পিডিএফ—উভয় ফাইলই আপলোড করা বাধ্যতামূলক!');
    }
    const bookCoverUrl = await this.cloudinaryService.uploadFile(files.bookCover[0], 'book_covers');
    const samplePdfUrl = await this.cloudinaryService.uploadFile(files.samplePdf[0], 'book_pdfs');
    
    return this.booksService.create({
      ...createBookDataDto,
      bookCover: bookCoverUrl,
      samplePdf: samplePdfUrl,
    });
  }

  // 2. Get All Books API (Public)
  @Get('all')
  async findAll() {
    return this.booksService.findAllBooks();
  }

  // 3. Get Single Book API (Public)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findBookById(id);
  }

  // 4. Update Book API (Admin Only)
  @Put('update/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bookCover', maxCount: 1 }, 
      { name: 'samplePdf', maxCount: 1 }, 
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFiles()
    files: UploadedBookFiles,
  ) {
    const updateData: any = { ...updateBookDto };

    // কভার ইমেজ চেঞ্জ করলে নতুনটা ক্লাউডিনারিতে আপলোড হবে
    if (files?.bookCover?.[0]) {
      updateData.bookCover = await this.cloudinaryService.uploadFile(files.bookCover[0], 'book_covers');
    }
    // স্যাম্পল পিডিএফ চেঞ্জ করলে নতুনটা আপলোড হবে
    if (files?.samplePdf?.[0]) {
      updateData.samplePdf = await this.cloudinaryService.uploadFile(files.samplePdf[0], 'book_pdfs');
    }

    return this.booksService.updateBook(id, updateData);
  }

  // 5. Delete Book API (Admin Only)
  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}