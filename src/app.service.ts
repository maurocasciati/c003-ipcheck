import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatisticsResponse } from './dtos/StatisticsResponse.dto';
import { TracesRequest } from './dtos/TracesRequest.dto';
import { TracesResponse } from './dtos/TracesResponse.dto';
import { StatisticsService } from './services/statistics.service';
import { TracesService } from './services/traces.service';

@Injectable()
export class AppService {
  constructor(protected readonly tracesService: TracesService, protected readonly statisticsService: StatisticsService) {}
  
  postTraces(tracesRequestBody: TracesRequest): Observable<TracesResponse> {
    return this.tracesService.requestTracesForIp(tracesRequestBody.ip);
  }

  getStatistics(): Observable<StatisticsResponse> {
    return this.statisticsService.calculateStatistics();
  }
}
