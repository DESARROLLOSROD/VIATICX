import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'VIATICX API',
      version: this.configService.get('APP_VERSION') || '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  getDetailedHealth() {
    return {
      status: 'ok',
      service: 'VIATICX API',
      version: this.configService.get('APP_VERSION') || '1.0.0',
      environment: this.configService.get('NODE_ENV'),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
