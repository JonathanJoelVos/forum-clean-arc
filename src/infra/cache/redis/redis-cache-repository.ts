import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    //"EX" (em segundos), 60 * 15 colocamos a data de expiração do cache para 15min
    await this.redis.set(key, value, "EX", 60 * 15); //15min
  }
}
