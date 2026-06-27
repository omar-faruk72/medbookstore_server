import { IsNotEmpty, IsString, IsNumberString, IsOptional } from 'class-validator';

export class CreatePdfDataDto {
  @IsString()
  @IsNotEmpty({ message: 'পিডিএফ এর নাম দেওয়া আবশ্যক!' })
  name!: string;

  @IsNumberString({}, { message: 'পিডিএফ এর দাম অবশ্যই একটি সংখ্যা হতে হবে!' })
  price!: string;

  @IsString()
  @IsNotEmpty({ message: 'পিডিএফ এর ডিটেইলস দেওয়া আবশ্যক!' })
  details!: string;

  @IsOptional()
  @IsString()
  specialFeatures?: string;
}