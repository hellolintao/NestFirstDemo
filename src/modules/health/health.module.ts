import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { VersionHealthIndicator } from './indicators/version.health';

@Module({
  imports: [TerminusModule], // 专用的健康检查模块
  controllers: [HealthController],
  providers: [VersionHealthIndicator],
})
export class HealthModule {}
