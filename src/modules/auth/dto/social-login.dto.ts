import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsNotEmpty({ message: 'নাম দেওয়া বাধ্যতামূলক' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'ইমেইল দেওয়া বাধ্যতামূলক' })
  @IsEmail({}, { message: 'সঠিক ইমেইল অ্যাড্রেস দিন' })
  email!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNotEmpty({ message: 'প্রোভাইডার (google/github/facebook) দেওয়া বাধ্যতামূলক' })
  @IsString()
  provider!: string;
}