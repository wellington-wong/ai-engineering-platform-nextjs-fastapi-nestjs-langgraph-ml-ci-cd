import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service.js';



import { DockerModule } from '../docker/docker.module.js';
import { SystemModule } from '../system/system.module.js';
import { HealthModule } from '../health/health.module.js';

import { MonitorsModule } from '../monitors/monitors.module.js';
import { AnomalyModule } from '../anomaly/anomaly.module.js';

@Module({

  imports: [SystemModule, DockerModule, HealthModule,
  MonitorsModule, AnomalyModule],
  providers: [CollectorService],
})
export class CollectorModule {}