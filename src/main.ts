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

  app.enableCors({
    origin: ['http://localhost:3000'],
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

  // ❌ এই try-catch ব্লকটির আর দরকার নেই, কারণ AppModule নিজেই এখন কানেকশন হ্যান্ডেল করছে
  // try {
  //   await connectDB();
  // } catch (error) { ... }

  await app.listen(port);
  console.log('==================================================');
  console.log(`🚀 MedBookStore Server is Running on: http://localhost:${port}/api/v1`);
  console.log('==================================================');
}

void bootstrap();