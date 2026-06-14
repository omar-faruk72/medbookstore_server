import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from './lib/dbConnect';
import getConfig from './config/db.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = getConfig();
  const port = config.port || 5000;

  //  CORS 
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  try {
    await connectDB();
  } catch (error) {
    console.error(
      '❌ সার্ভার চালু হওয়ার সময় মঙ্গোডিবি কানেকশনে বড় সমস্যা হয়েছে!',
    );
  }

  await app.listen(port);
  console.log('==================================================');
  console.log(`🚀 MedBookStore Server is Running on: http://localhost:${port}/api/v1`);
  console.log('==================================================');
}
void bootstrap();