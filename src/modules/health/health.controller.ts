import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';

import { VersionHealthIndicator } from './indicators/version.health';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Controller({ path: 'health', version: '1' })
export class HealthController {
  // 健康检查、数据库检查、版本检查
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly version: VersionHealthIndicator,
  ) {}

  @Get()
  @HealthCheck() // 标记这个接口为健康检查接口
  checkHealth() {
    return this.health.check([async () => this.db.pingCheck('database'), () => this.version.getValue('version')]);
  }
}
