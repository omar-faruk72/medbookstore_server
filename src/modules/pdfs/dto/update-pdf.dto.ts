import { PartialType } from '@nestjs/mapped-types';
import { CreatePdfDataDto } from './create-pdf.dto'; 

export class UpdatePdfDto extends PartialType(CreatePdfDataDto) {}