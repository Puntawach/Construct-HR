import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { TypedConfigService } from 'src/config/typed-config.service';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly typeConfigService: TypedConfigService) {
    cloudinary.config({
      cloud_name: typeConfigService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: typeConfigService.get('CLOUDINARY_API_KEY'),
      api_secret: typeConfigService.get('CLOUDINARY_API_SECRET'),
    });
  }

  upload(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error || !result) {
          reject(new InternalServerErrorException('Cloudinary upload failed'));
          return;
        }
        resolve(result);
      });
      Readable.from(file.buffer).pipe(stream);
    });
  }

  async uploadMany(
    files: Express.Multer.File[],
    batchSize = 3,
  ): Promise<UploadApiResponse[]> {
    const results: UploadApiResponse[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((file) => this.upload(file)),
      );
      results.push(...batchResults);
    }

    return results;
  }
}
