import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { TracesRequest } from './dtos/TracesRequest.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/traces')
  postTraces(@Body() tracesRequestBody: TracesRequest) {
    return this.appService.postTraces(tracesRequestBody);
  }
}
