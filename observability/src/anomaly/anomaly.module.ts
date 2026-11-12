import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnomalyService } from './anomaly.service.js';

@Module({
  imports: [HttpModule],
  providers: [AnomalyService],
  exports: [AnomalyService],
})
export class AnomalyModule {}
