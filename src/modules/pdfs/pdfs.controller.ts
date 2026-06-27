import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PdfsService } from './pdfs.service';
import { CreatePdfDataDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface UploadedPdfFiles {
  pdfCover?: any[];
  pdf?: any[];
}

@Controller('pdfs')
export class PdfsController {
  constructor(
    private readonly pdfsService: PdfsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // 1. Post API (Admin Only)
  @Post('post')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdfCover', maxCount: 1 }, 
      { name: 'pdf', maxCount: 1 }, 
    ]),
  )
  async create(
    @Body() createPdfDataDto: CreatePdfDataDto,
    @UploadedFiles()
    files: UploadedPdfFiles,
  ) {
    if (!files || !files.pdfCover || !files.pdf) {
      throw new BadRequestException('পিডিএফ কভার ইমেজ এবং মেইন পিডিএফ ফাইল—উভয়ই আপলোড করা বাধ্যতামূলক!');
    }
    
    // Cloudinary তে ফাইল আপলোড ও ইউআরএল জেনারেট
    const pdfCoverUrl = await this.cloudinaryService.uploadFile(files.pdfCover[0], 'pdf_covers');
    const pdfUrl = await this.cloudinaryService.uploadFile(files.pdf[0], 'secure_pdfs');
    
    return this.pdfsService.create({
      ...createPdfDataDto,
      pdfCover: pdfCoverUrl,
      pdf: pdfUrl,
    });
  }

  // 2. Get All PDFs API (Public)
  @Get('all')
  async findAll() {
    return this.pdfsService.findAllPdfs();
  }

  // 3. Get Single PDF API (Public)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pdfsService.findPdfById(id);
  }

  // 4. Update PDF API (Admin Only)
  @Put('update/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdfCover', maxCount: 1 }, 
      { name: 'pdf', maxCount: 1 }, 
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePdfDto: UpdatePdfDto,
    @UploadedFiles()
    files: UploadedPdfFiles,
  ) {
    const updateData: any = { ...updatePdfDto };

    // কভার ইমেজ চেঞ্জ করলে নতুনটা আপলোড হবে
    if (files?.pdfCover?.[0]) {
      updateData.pdfCover = await this.cloudinaryService.uploadFile(files.pdfCover[0], 'pdf_covers');
    }
    // মেইন পিডিএফ ফাইল চেঞ্জ করলে নতুনটা আপলোড হবে
    if (files?.pdf?.[0]) {
      updateData.pdf = await this.cloudinaryService.uploadFile(files.pdf[0], 'secure_pdfs');
    }

    return this.pdfsService.updatePdf(id, updateData);
  }
}