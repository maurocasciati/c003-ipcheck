import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { Observable } from 'rxjs';
import { RedisCache } from './redis.instance';

@Injectable()
export class RedisService {
  private redisClient: RedisClient;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {
    this.redisClient = this.cacheManager.store.getClient();
  }

  get<T>(key: string): Observable<T> {
    return new Observable((subscriber) => {
      this.redisClient.get(key, (error, result) => {
        subscriber.next(result as T);
        subscriber.complete();
      });
    });
  }

  hgetall(key: string): Observable<{ [key: string]: string }> {
    return new Observable((subscriber) => {
      this.redisClient.hgetall(key, (error, result) => {
        subscriber.next(result);
        subscriber.complete();
      });
    });
  }

  hincrby(key: string, field: string) {
    this.redisClient.hincrby(key, field, 1);
  }
}