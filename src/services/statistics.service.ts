import { Injectable } from '@nestjs/common';
import { Observable, map, forkJoin } from 'rxjs';
import { CountryValue, StatisticsResponse } from 'src/dtos/StatisticsResponse.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class StatisticsService {
  private static LONGEST_DISTANCE_COUNTRY_KEY = 'longest_distance_country';
  private static LONGEST_DISTANCE_VALUE_KEY = 'longest_distance_value';
  private static MOST_TRACED_KEY = 'most_traced';

  constructor(private readonly redisService: RedisService) {}
  
  calculateStatistics(): Observable<StatisticsResponse> {
    return forkJoin({
      longest_distance: this.calculateLongestDistanceStatistic(),
      most_traced: this.calculateMostTracedStatistic(),
    });
  }

  calculateLongestDistanceStatistic(): Observable<CountryValue> {
    return forkJoin({
      country: this.redisService.get<string>(StatisticsService.LONGEST_DISTANCE_COUNTRY_KEY),
      value: this.redisService.get<number>(StatisticsService.LONGEST_DISTANCE_VALUE_KEY),
    });
  }

  calculateMostTracedStatistic(): Observable<CountryValue> {
    return this.redisService.hgetall(StatisticsService.MOST_TRACED_KEY).pipe(
      map((traceMetrics) => {
        const mostTracedCountry = traceMetrics && Object.keys(traceMetrics).reduce((a, b) => +traceMetrics[a] > +traceMetrics[b] ? a : b);
        return {
          country: mostTracedCountry,
          value: mostTracedCountry ? +traceMetrics[mostTracedCountry] : null,
        } as CountryValue
      })
    )
  }
}