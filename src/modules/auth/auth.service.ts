import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  // register api
  async register(
    createAuthDto: CreateAuthDto,
    clientIp: string,
    uploadedImageUrl?: string,
  ): Promise<{ message: string; user: Record<string, unknown> }> {
    const { name, email, password, address } = createAuthDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('এই ইমেইলটি দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।');
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
      message: 'ইউজার রেজিস্ট্রেশন সফল হয়েছে!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        address: savedUser.address,
        imageUrl: savedUser.imageUrl,
        ipAddresses: savedUser.ipAddresses,
      },
    };
  }

  // login api
  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    // ১. ইমেইল দিয়ে ইউজার খোঁজা
    const user = await this.userModel.findOne({ email: email.toLowerCase().trim() });

    // 🔒 যদি ইউজার না পাওয়া যায় অথবা ডাটাবেজে পাসওয়ার্ড না থাকে
    if (!user || !user.password) {
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }

    // 🚀 টাইপস্ক্রিপ্ট সেফ পাসওয়ার্ড কম্পেয়ার (Error ফিক্সড)
    const isPasswordMatched = await bcrypt.compare(password, user.password as string);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }

    // ৩. লগইন সফল 
    return {
      success: true,
      message: 'লগইন সফল হয়েছে!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // 👑 রোল যদি স্কিমাতে না-ও থাকে, আমরা টাইপ সেফটির জন্য ফলব্যাক রেখে দিচ্ছি
        role: (user as any).role || 'user',
      },
    };
  }
}