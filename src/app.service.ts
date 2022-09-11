import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TracesRequest } from './dtos/TracesRequest.dto';
import { TracesResponse } from './dtos/TracesResponse.dto';
import { TracesService } from './services/traces.service';

@Injectable()
export class AppService {
  constructor(protected readonly tracesService: TracesService) {}

  postTraces(tracesRequestBody: TracesRequest): Observable<TracesResponse> {
    return this.tracesService.requestTracesForIp(tracesRequestBody.ip);
  }
}
