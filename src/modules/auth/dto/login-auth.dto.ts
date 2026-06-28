import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail({}, { message: 'সঠিক ইমেইল অ্যাড্রেস দিন' })
  @IsNotEmpty({ message: 'ইমেইল দেওয়া বাধ্যতামূলক' })
  email!: string;

  @IsNotEmpty({ message: 'পাসওয়ার্ড দেওয়া বাধ্যতামূলক' })
  @MinLength(6, { message: 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে' })
  password!: string;
}