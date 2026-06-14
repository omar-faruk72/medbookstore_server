import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import getConfig from './config/db.config';
const config = getConfig();

@Module({
  imports: [
    MongooseModule.forRoot(config.database.uri || process.env.MONGO_URI || ''),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}