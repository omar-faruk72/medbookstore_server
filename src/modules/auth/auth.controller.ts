import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  Req,
  Ip,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { UpdateMeDto, UpdateRoleDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ১. Credentials Registration
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async register(
    @Body() createAuthDto: CreateAuthDto,
    @Ip() ip: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let uploadedImageUrl = '';
    if (file) {
      uploadedImageUrl = await this.cloudinaryService.uploadFile(file, 'users');
    }
    return this.authService.register(createAuthDto, ip, uploadedImageUrl);
  }

  // ২. Credentials Login
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  // ৩. NextAuth Social Sync (Google, GitHub, Facebook)
  @Post('social-sync')
  async socialSync(@Body() socialLoginDto: SocialLoginDto, @Ip() ip: string) {
    return this.authService.socialLoginSync(socialLoginDto, ip);
  }

  // ৪. All Users List (Admin Only)
  @Get('users')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.authService.findAllUsers();
  }

  // ৫. Get Logged In User Profile (Me API)
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: any) {
    return this.authService.getMe(req.user.id);
  }

  // ৬. Update User Role (Admin Only)
  @Put('update-role/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.authService.updateUserRole(id, updateRoleDto);
  }

  // ৭. Search User By Email 
  @Get('search')
  @UseGuards(AuthGuard)
  async searchByEmail(@Query('email') email: string) {
    return this.authService.searchUserByEmail(email);
  }

  // ৮. Update Profile (User Himself - No Email Update)
  @Put('update-me')
  @UseGuards(AuthGuard)
  async updateMe(@Req() req: any, @Body() updateMeDto: UpdateMeDto) {
    return this.authService.updateProfile(req.user.id, updateMeDto);
  }
}