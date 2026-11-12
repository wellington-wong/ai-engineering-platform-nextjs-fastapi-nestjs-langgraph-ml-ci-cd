import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service.js';

interface AnomalyPredictionRequest {
  system: {
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    diskUsagePercent: number;
  };
}

@Injectable()
export class AnomalyService {
  private readonly logger = new Logger(AnomalyService.name);
  private readonly mlServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.mlServiceUrl = this.configService.getOrThrow<string>('ML_SERVICE_URL');
  }

  async predict(systemMetricId: number, metrics: AnomalyPredictionRequest) {
    try {console.debug(`${this.mlServiceUrl}/api/v1/anomaly/predict`, metrics)
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.mlServiceUrl}/api/v1/anomaly/predict`,
          metrics,
          { timeout: 5000 },
        ),
      );

      await this.prisma.systemAnomaly.create({
        data: {
          isAnomaly: data.isAnomaly,
          anomalyScore: data.anomalyScore,
          modelVersion: data.modelVersion,



          systemMetricId
        },
      });
      return data;
    } catch (error) {
      this.logger.error(
        'ML anomaly prediction failed',
        error instanceof Error ? error.message : String(error),
      );

      return null;
    }
  }
}
