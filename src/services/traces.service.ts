import { Injectable } from '@nestjs/common';
import { Observable, switchMap, map } from 'rxjs';
import { ApiLayerClient } from 'src/clients/apilayer.client';
import { IpApiClient } from 'src/clients/ipapi.client';
import { Currency, TracesResponse } from 'src/dtos/TracesResponse.dto';
import { BASE_COUNTRY } from 'src/utils/constants';
import { getDistanteToBaseCountry } from 'src/utils/distance.utils';

@Injectable()
export class TracesService {
  constructor(protected readonly ipapiClient: IpApiClient, protected readonly apilayerClient: ApiLayerClient) {}

  requestTracesForIp(ip: string): Observable<TracesResponse> {
    return this.ipapiClient.getIpInformation(ip).pipe(
      switchMap((ipData) => this.apilayerClient.getCurrencyRate(ipData.currency).pipe(
        map((rate) => ({
          ip: ipData.query,
          name: ipData.country,
          code: ipData.countryCode,
          lat: ipData.lat,
          lon: ipData.lon,
          currencies: this.buildCurrenciesResponse(ipData.currency, rate),
          distance_to_usa: getDistanteToBaseCountry(ipData.lat, ipData.lon)
        } as TracesResponse))
      ))
    )
  }

  private buildCurrenciesResponse(currency: string, conversion_rate: number): Currency[] {
    return [
      BASE_COUNTRY.currency,
      {
        iso: currency,
        symbol: '',
        conversion_rate,
      }
    ]
  }
}