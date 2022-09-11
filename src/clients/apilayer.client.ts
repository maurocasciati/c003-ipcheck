import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map, tap, switchMap, of } from 'rxjs';
import { RedisService } from 'src/redis/redis.service';
import { API_LAYER_KEY, API_LAYER_URL, BASE_COUNTRY } from 'src/utils/constants';

@Injectable()
export class ApiLayerClient {
  private static CACHE_DURATION = 60 * 60;

  constructor(private readonly httpService: HttpService, private readonly redisService: RedisService) {}

  getCurrencyRate(currency: string): Observable<number> {
    return this.redisService.get<number>(currency).pipe(
      switchMap((cachedCurrency) => 
        cachedCurrency ? of(cachedCurrency) : this.fetchCurrency(currency)
      )
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
      tap((rate) => this.redisService.set(currency, rate, ApiLayerClient.CACHE_DURATION))
    );
  }
}
