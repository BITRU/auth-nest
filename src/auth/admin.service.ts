import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

import { BlockUserActiveTokensDto } from './dto';

@Injectable()
export class AdminAuthService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }
  async blacklist(dto: BlockUserActiveTokensDto): Promise<string> {
    await this.redis.set(dto.username, 'block');
    return await this.redis.ping();
  }
}
