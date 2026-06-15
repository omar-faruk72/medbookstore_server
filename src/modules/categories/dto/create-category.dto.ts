import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'ক্যাটাগরির নাম দেওয়া আবশ্যক!' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}