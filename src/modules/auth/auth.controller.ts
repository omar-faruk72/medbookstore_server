import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Ip,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() createAuthDto: CreateAuthDto,
    @Ip() ip: string,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<unknown> {
    let uploadedImageUrl = '';
    if (file) {
      uploadedImageUrl = await this.cloudinaryService.uploadFile(file, 'users');
    }
    return this.authService.register(createAuthDto, ip, uploadedImageUrl);
  }
}