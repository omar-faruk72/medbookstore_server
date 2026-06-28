import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'নাম দেওয়া বাধ্যতামূলক' })
  @IsString({ message: 'নাম অবশ্যই স্ট্রিং হতে হবে' })
  name!: string;

  @IsNotEmpty({ message: 'ইমেইল দেওয়া বাধ্যতামূলক' })
  @IsEmail({}, { message: 'সঠিক ইমেইল অ্যাড্রেস দিন' })
  email!: string;

  @IsNotEmpty({ message: 'পাসওয়ার্ড দেওয়া বাধ্যতামূলক' })
  @MinLength(6, { message: 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে' })
  @IsString({ message: 'পাসওয়ার্ড অবশ্যই স্ট্রিং হতে হবে' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'ইメージ ইউআরএল স্ট্রিং হতে হবে' })
  imageUrl?: string;

  @IsOptional()
  @IsString({ message: 'ঠিকানা অবশ্যই স্ট্রিং হতে হবে' })
  address?: string;
}