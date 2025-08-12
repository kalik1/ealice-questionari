import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {

  constructor(private readonly dataSource: DataSource) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getHealth(): Promise<string> {
    // test database connection
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      throw new Error('Database connection failed');
    }
    return 'OK';
  }
}
