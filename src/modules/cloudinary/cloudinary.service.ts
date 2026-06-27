import { BadRequestException, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';
import getConfig from '../../config/db.config';

interface CloudinaryUploader {
  upload_stream: (
    options: UploadApiOptions,
    callback: (error: unknown, result: UploadApiResponse | undefined) => void,
  ) => unknown;
}

interface CustomMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    const config = getConfig();

    cloudinary.config({
      cloud_name: config.cloudinary.cloudName ?? '',
      api_key: config.cloudinary.apiKey ?? '',
      api_secret: config.cloudinary.apiSecret ?? '',
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    customFolder = 'general',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const safeFile = file as unknown as CustomMulterFile;

      let resourceType: 'image' | 'video' | 'raw' = 'image';
      let targetFolder = `medbookstore/${customFolder}`;

      if (
        safeFile &&
        safeFile.mimetype &&
        safeFile.mimetype.startsWith('video/')
      ) {
        resourceType = 'video';
        targetFolder += '/videos';
      } else if (safeFile && safeFile.mimetype === 'application/pdf') {
        resourceType = 'raw';
        targetFolder += '/pdfs';
      } else if (
        safeFile &&
        safeFile.mimetype &&
        safeFile.mimetype.startsWith('image/')
      ) {
        resourceType = 'image';
        targetFolder += '/images';
      } else {
        return reject(
          new BadRequestException(
            'অসমর্থিত ফাইল ফরম্যাট! শুধু ইমেজ, ভিডিও এবং পিডিএফ আপলোড করা যাবে।',
          ),
        );
      }

      const rawUploader = (cloudinary as Record<string, unknown>).uploader;
      const uploader = rawUploader as CloudinaryUploader;

      const uploadStream = uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: resourceType,
        },
        (error: unknown, result: UploadApiResponse | undefined) => {
          if (error) {
            let errorMessage = '';

            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
              errorMessage = JSON.stringify(error);
            } else if (typeof error === 'string') {
              errorMessage = error;
            } else {
              errorMessage = (error as { toString?: () => string }).toString
                ? (error as { toString: () => string }).toString()
                : 'Unknown error occurred';
            }

            return reject(new Error(errorMessage));
          }
          resolve(result?.secure_url || '');
        },
      );

      if (
        uploadStream &&
        typeof (uploadStream as Record<string, unknown>).end === 'function'
      ) {
        const streamer = uploadStream as { end: (buf: Buffer) => void };
        streamer.end(safeFile.buffer);
      } else {
        return reject(
          new BadRequestException(
            'ক্লাউডিনারি স্ট্রিম তৈরি করতে সমস্যা হয়েছে!',
          ),
        );
      }
    });
  }
}
