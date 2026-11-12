import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MonitorsModule } from './monitors/monitors.module.js';
import { MetricsModule } from './metrics/metrics.module.js';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from '@nestjs/config';


import configuration from './config/configuration.js';
import { validationSchema } from './config/validation.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SystemModule } from './system/system.module.js';
import { DockerModule } from './docker/docker.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectorModule } from './collector/collector.module.js';
import { AnomalyModule } from './anomaly/anomaly.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();
@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'observability',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    MonitorsModule,


    MetricsModule,
    HealthModule,
    PrismaModule,
    SystemModule,
    DockerModule,
    CollectorModule,
    AnomalyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
