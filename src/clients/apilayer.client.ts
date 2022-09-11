import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { API_LAYER_KEY, API_LAYER_URL, BASE_COUNTRY } from 'src/utils/constants';

@Injectable()
export class ApiLayerClient {
  constructor(private readonly httpService: HttpService) {}

  getCurrencyRate(currency: string): Observable<number> {
    return this.httpService.get(API_LAYER_URL, {
      headers: { apiKey: API_LAYER_KEY },
      params: {
        base: currency,
        symbols: BASE_COUNTRY.currency.iso
      }
    }
    ).pipe(
      map(response => response.data.rates[BASE_COUNTRY.currency.iso])
    );
  }
}
