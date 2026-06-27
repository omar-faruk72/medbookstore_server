import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pdf } from './schema/pdf.schema';

@Injectable()
export class PdfsService {
  constructor(
    @InjectModel(Pdf.name) private readonly pdfModel: Model<Pdf>,
  ) {}

  // Helper function to parse special features
  private parseFeatures(specialFeatures: any): string[] {
    if (!specialFeatures) return [];
    try {
      return typeof specialFeatures === 'string' 
        ? JSON.parse(specialFeatures) 
        : specialFeatures;
    } catch {
      return specialFeatures.split(',').map((f: string) => f.trim());
    }
  }

  // 1. Create PDF
  async create(pdfData: any): Promise<Pdf> {
    const featuresArray = this.parseFeatures(pdfData.specialFeatures);

    const newPdf = new this.pdfModel({
      ...pdfData,
      price: Number(pdfData.price),
      specialFeatures: featuresArray,
    });

    return newPdf.save();
  }

  // 2. Find All PDFs
  async findAllPdfs(): Promise<Pdf[]> {
    return this.pdfModel.find().sort({ createdAt: -1 }).exec();
  }

  // 3. Find Single PDF By ID
  async findPdfById(id: string): Promise<Pdf> {
    const pdf = await this.pdfModel.findById(id).exec();
    if (!pdf) {
      throw new NotFoundException('এই আইডি দিয়ে কোনো পিডিএফ খুঁজে পাওয়া যায়নি!');
    }
    return pdf;
  }

  // 4. Update PDF
  async updatePdf(id: string, updateData: any): Promise<Pdf> {
    if (updateData.specialFeatures) {
      updateData.specialFeatures = this.parseFeatures(updateData.specialFeatures);
    }
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }

    const updatedPdf = await this.pdfModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();

    if (!updatedPdf) {
      throw new NotFoundException('আপডেট করার জন্য কোনো পিডিএফ খুঁজে পাওয়া যায়নি!');
    }
    return updatedPdf;
  }
}