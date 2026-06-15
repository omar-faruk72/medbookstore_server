import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDataDto } from './dto/create-book.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // post api
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
    files: { bookCover?: Express.Multer.File[]; samplePdf?: Express.Multer.File[] },
  ) {
    if (!files || !files.bookCover || !files.samplePdf) {
      throw new BadRequestException('বইয়ের কভার ইমেজ এবং স্যাম্পল পিডিএফ—উভয় ফাইলই আপলোড করা বাধ্যতামূলক!');
    }
    const bookCoverUrl = await this.cloudinaryService.uploadFile(files.bookCover[0], 'book_covers');
    const samplePdfUrl = await this.cloudinaryService.uploadFile(files.samplePdf[0], 'book_pdfs');
    return this.booksService.create({
      ...createBookDataDto,
      bookCover: bookCoverUrl,
      samplePdf: samplePdfUrl,
    });
  }
  // gel home page book
  @Get('active')
  async findActive() {
    return this.booksService.findActiveBooks();
  }
  // gel admin page book
  @Get('admin/all')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findAllForAdmin() {
    return this.booksService.findAllBooksForAdmin();
  }
}