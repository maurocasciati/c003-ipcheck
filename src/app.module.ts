import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpApiClient } from './clients/ipapi.client';
import { ApiLayerClient } from './clients/apilayer.client';
import { TracesService } from './services/traces.service';
import { RedisModule } from './redis/redis.module';
import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [HttpModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, IpApiClient, ApiLayerClient, TracesService, StatisticsService],
})
export class AppModule {}
