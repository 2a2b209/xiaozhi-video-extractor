import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { VideoModule } from './video/video.module';
import { HistoryModule } from './history/history.module';
import { DownloadModule } from './download/download.module';

@Module({
  imports: [VideoModule, HistoryModule, DownloadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
