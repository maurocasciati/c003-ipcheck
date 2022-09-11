import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IpApiResponse } from 'src/dtos/IpApiResponse.dto';
import { IP_API_PARAMS, IP_API_URL } from 'src/utils/constants';

@Injectable()
export class IpApiClient {
  constructor(private readonly httpService: HttpService) {}

  getIpInformation(ip: string): Observable<IpApiResponse> {
    return this.httpService.get(`${IP_API_URL}${ip}?${IP_API_PARAMS}`).pipe(
      map(response => response.data as IpApiResponse)
    );
  }
}
