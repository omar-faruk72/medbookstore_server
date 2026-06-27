import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Ip,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  // registe pai
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

  // login api
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // get me api 
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    return this.authService.getMe(userId);
  }
}