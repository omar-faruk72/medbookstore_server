import { IsNotEmpty, IsString, IsNumberString, IsOptional } from 'class-validator';

export class CreateBookDataDto {
  @IsString()
  @IsNotEmpty({ message: 'বইয়ের নাম দেওয়া আবশ্যক!' })
  name!: string;

  @IsNumberString({}, { message: 'বইয়ের দাম অবশ্যই একটি সংখ্যা হতে হবে!' })
  price!: string;

  @IsString()
  @IsNotEmpty({ message: 'বইয়ের ডিটেইলস দেওয়া আবশ্যক!' })
  details!: string;

  @IsOptional()
  @IsString()
  specialFeatures?: string;
}