import { Injectable } from '@nestjs/common';
import { Observable, switchMap, map, tap } from 'rxjs';
import { ApiLayerClient } from 'src/clients/apilayer.client';
import { IpApiClient } from 'src/clients/ipapi.client';
import { TracesResponse } from 'src/dtos/TracesResponse.dto';
import { getDistanteToBaseCountry } from 'src/utils/distance.utils';
import { StatisticsService } from './statistics.service';

@Injectable()
export class TracesService {
  constructor(
    private readonly ipapiClient: IpApiClient,
    private readonly apilayerClient: ApiLayerClient,
    private readonly statisticsService: StatisticsService,
  ) {}

  requestTracesForIp(ip: string): Observable<TracesResponse> {
    return this.ipapiClient.getIpInformation(ip).pipe(
      switchMap((ipData) => this.apilayerClient.getCurrencies(ipData.currency).pipe(
        map((currencies) => ({
          ip: ipData.query,
          name: ipData.country,
          code: ipData.countryCode,
          lat: ipData.lat,
          lon: ipData.lon,
          currencies,
          distance_to_usa: getDistanteToBaseCountry(ipData.lat, ipData.lon)
        } as TracesResponse))
      )),
      tap((response) => this.statisticsService.recordTraceMetrics(response))
    )
  }
}