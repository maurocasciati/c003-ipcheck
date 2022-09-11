import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { StatisticsResponse } from './dtos/StatisticsResponse.dto';
import { TracesRequest } from './dtos/TracesRequest.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/traces')
  postTraces(@Body() tracesRequestBody: TracesRequest) {
    return this.appService.postTraces(tracesRequestBody);
  }

  @Get('/statistics')
  getStatistics(): Observable<StatisticsResponse> {
    return this.appService.getStatistics();
  }
}
