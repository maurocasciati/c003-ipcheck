import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IpApiResponse } from 'src/dtos/IpApiResponse.dto';
import { IP_API_URL } from 'src/utils/constants';

@Injectable()
export class IpApiClient {
  constructor(private readonly httpService: HttpService) {}

  getIpInformation(ip: string): Observable<IpApiResponse> {
    return this.httpService.get(`${IP_API_URL}/${ip}`, {
      params: {
        fields: 'status,message,country,countryCode,lat,lon,currency,query',
      }
    }
    ).pipe(
      map(response => { 
        if (response.data && response.data.status === 'success') {
          return response.data as IpApiResponse; 
        } else {
          throw new InternalServerErrorException('Error when fetching IP information');
        }
      })
    );
  }
}
