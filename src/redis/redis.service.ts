import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis();
    this.setRandomString(10)
      .then(() => console.log('Random records generated successfully.'))
      .catch((error) => console.log('Error generating random records:', error))
      .finally(() => this.client.disconnect());
  }

  getRedisClient(): Redis {
    return this.client;
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  private async setRandomString(numRecord: number): Promise<void> {
    const pipeline = this.client.multi();

    for (let i = 0; i < numRecord; i++) {
      const key = `record:${i}`;
      const value = this.generateRandomString(10);

      this.client.set(key, value, (err, reply) => {
        if (err) {
          console.error(`Error storing ${key}: ${err}`);
        } else {
          console.log(`Stored ${key} with value ${value} and reply ${reply}`);
        }
      });
    }

    await pipeline.exec();
  }
}
