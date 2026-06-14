import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

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
}