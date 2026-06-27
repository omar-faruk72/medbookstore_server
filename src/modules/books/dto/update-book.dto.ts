import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDataDto } from './create-book.dto'; 

export class UpdateBookDto extends PartialType(CreateBookDataDto) {}