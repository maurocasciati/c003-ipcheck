import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map, tap, switchMap, of, catchError } from 'rxjs';
import { Currency } from 'src/dtos/TracesResponse.dto';
import { RedisService } from 'src/redis/redis.service';
import { API_LAYER_KEY, API_LAYER_URL, BASE_COUNTRY } from 'src/utils/constants';

@Injectable()
export class ApiLayerClient {
  private static CACHE_DURATION = 60 * 60;

  constructor(private readonly httpService: HttpService, private readonly redisService: RedisService) {}

  getCurrencies(currency: string): Observable<Currency[]> {
    if (currency === BASE_COUNTRY.currency.iso) {
      return of([ BASE_COUNTRY.currency ]);
    }

    return this.redisService.get<number>(currency).pipe(
      switchMap((cachedRate) => cachedRate ? of(cachedRate) : this.fetchCurrency(currency)),
      map((rate) => [
        BASE_COUNTRY.currency,
        {
          iso: currency,
          symbol: '',
          conversion_rate: rate,
        }
      ])
    )
  }

  private fetchCurrency(currency: string): Observable<number> {
    return this.httpService.get(API_LAYER_URL, {
      headers: { apiKey: API_LAYER_KEY },
      params: {
        base: currency,
        symbols: BASE_COUNTRY.currency.iso
      }
    }
    ).pipe(
      map((response) => response.data.rates[BASE_COUNTRY.currency.iso]),
      tap((rate) => this.redisService.set(currency, rate, ApiLayerClient.CACHE_DURATION)),
      catchError(() => {
        console.error('Error when fetching currency rate information. Retrieving null')
        return of(null)
      }),
    );
  }
}
