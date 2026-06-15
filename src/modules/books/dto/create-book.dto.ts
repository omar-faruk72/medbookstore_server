import { IsNotEmpty, IsString, IsNumberString, IsOptional, IsEnum } from 'class-validator';
import { PublishStatus } from '../schemas/book.schema';

export class CreateBookDataDto {
  @IsString()
  @IsNotEmpty({ message: 'বইয়ের নাম দেওয়া আবশ্যক!' })
  name: string;

  @IsNumberString({}, { message: 'বইয়ের দাম অবশ্যই একটি সংখ্যা হতে হবে!' })
  price: string; 

  @IsString()
  @IsNotEmpty({ message: 'ক্যাটাগরি আইডি দেওয়া আবশ্যক!' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'বইয়ের ডিটেইলস দেওয়া আবশ্যক!' })
  details: string;

  @IsOptional()
  @IsString()
  specialFeatures?: string;

  @IsOptional()
  @IsEnum(PublishStatus, { message: 'স্ট্যাটাস অবশ্যই active অথবা draft হতে হবে' })
  publishStatus?: PublishStatus;
}