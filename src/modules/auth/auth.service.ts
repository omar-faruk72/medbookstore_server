import { BadRequestException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { UpdateMeDto, UpdateRoleDto } from './dto/update-user.dto';
import { User, UserRole } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // ১. Register
  async register(createAuthDto: CreateAuthDto, clientIp: string, uploadedImageUrl?: string) {
    const { name, email, password, address } = createAuthDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('এই ইমেইলটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      address: address ?? '',
      imageUrl: uploadedImageUrl ?? '',
      ipAddresses: [clientIp],
      provider: 'credentials',
    });

    const savedUser = await newUser.save();

    return {
      message: 'ইউজার রেজিস্ট্রেশন সফল হয়েছে!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        address: savedUser.address,
        imageUrl: savedUser.imageUrl,
      },
    };
  }

  // ২. Login
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }
    
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return {
      success: true,
      message: 'লগইন সফল হয়েছে!',
      accessToken: token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
    };
  }

  // ৩. Social Login Sync (NextAuth এর জন্য)
  async socialLoginSync(socialLoginDto: SocialLoginDto, clientIp: string) {
    const { name, email, imageUrl, provider } = socialLoginDto;
    let user = await this.userModel.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      user = new this.userModel({
        name,
        email,
        imageUrl: imageUrl ?? '',
        provider,
        role: UserRole.USER,
        ipAddresses: [clientIp],
      });
      await user.save();
    } else {
      if (!user.ipAddresses.includes(clientIp)) {
        user.ipAddresses.push(clientIp);
        await user.save();
      }
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'সোশ্যাল লগইন সফল হয়েছে!',
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
    };
  }

  // ৪. Get Me
  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password'); 
    if (!user) {
      throw new UnauthorizedException('ইউজার পাওয়া যায়নি বা টোকেনটি অবৈধ!');
    }
    return user;
  }

  // ৫. Find All Users (Admin Only)
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').sort({ createdAt: -1 }).exec();
  }

  // ৬. Update User Role (Admin Only)
  async updateUserRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: { role: updateRoleDto.role } }, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('এই আইডি দিয়ে কোনো ইউজার খুঁজে পাওয়া যায়নি!');
    }
    return updatedUser;
  }

  // ৭. Search User By Email
  async searchUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('সার্চ করার জন্য ইমেইল কোয়েরি প্যারামিটার পাঠানো আবশ্যক!');
    }
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() }).select('-password');
    if (!user) {
      throw new NotFoundException('এই ইমেইল দিয়ে কোনো ইউজার রেজিস্টার্ড নেই!');
    }
    return user;
  }

  // ৮. Update Profile (User Himself)
  async updateProfile(userId: string, updateMeDto: UpdateMeDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateMeDto }, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('ইউজার প্রোফাইল আপডেট করা সম্ভব হয়নি!');
    }
    return updatedUser;
  }
}