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

  set(key: string, value: string, duration?: number) {
    duration ? this.redisClient.set(key, value, 'EX', duration) : this.redisClient.set(key, value);
  }

  get<T>(key: string): Observable<T> {
    return new Observable((subscriber) => {
      this.redisClient.get(key, (error, result) => {
        subscriber.next(result as T);
        subscriber.complete();
      });
    });
  }

  hincrby(key: string, field: string) {
    this.redisClient.hincrby(key, field, 1);
  }

  hgetall(key: string): Observable<{ [key: string]: string }> {
    return new Observable((subscriber) => {
      this.redisClient.hgetall(key, (error, result) => {
        subscriber.next(result);
        subscriber.complete();
      });
    });
  }
}