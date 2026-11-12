import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  getLatestSystemMetrics() {
    return this.prisma.systemMetric.findFirst({
      orderBy: {
        timestamp: 'desc',
      },

    });
  }

  getSystemMetrics(minutes = 60) {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const systemMetrics = this.prisma.systemMetric
      .findMany({
        where: {
          timestamp: {
            gte: since,
          },
        },
        include: {
          systemAnomaly: true,
        },
        orderBy: {
          timestamp: 'asc',
        },

        });
      return systemMetrics .map((metric) => ({
        ...metric,
        systemAnomaly: metric.systemAnomaly
          ? {
              ...metric.systemAnomaly,
              id: metric.systemAnomaly.id.toString(),
            }
          : null,

      }));
  }


  getContainerMetrics(containerId: string, minutes = 60) {
    const since = new Date(
      Date.now() - minutes * 60  * 1000,
    );

    return this.prisma.containerMetric.findMany({
      where: {
        containerId,

        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
  }




}