/**
 *
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';
import { valid } from 'semver';

import { version } from '../../../../package.json';
import { Config } from '../../../config/configuration';

/**
 * 当版本健康检查通过的时候，返回附加的数据
 * Additional data returned when the version health check is healthy.
 */
type VersionHealthUpAdditionalData = {
  value: string;
  source: 'env' | 'package.json';
};

/**
 * 当版本健康检查没通过的时候，返回的附加数据
 * Additional data returned when the version health check is unhealthy.
 */
type VersionHealthDownAdditionalData = {
  error: string;
};

// 创建版本检查指示器结果
@Injectable()
export class VersionHealthIndicator extends HealthIndicatorService {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly configService: ConfigService<Config, true>,
  ) {
    super();
  }

  /**
   * 获取程序版本。如果版本没有找到或者不是一个有价值语义，则返回一个down状态
   * 版本是从 package.json 和环境变量中获取到的APP_VERSION
   *
   * Get the application version value. If the version is not found or not a valid semver, it returns a down status.
   * Version is sourced from APP_VERSION environment variable with fallback to package.json.
   * @param key - The key to identify the version health check
   * @returns The version information including source
   */
  getValue(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    // Try to get version from environment variable first 尝试先从环境变量中获取版本号
    const envVersion = this.configService.get('APP_VERSION', { infer: true });
    let value: string | null = null;
    let source: 'env' | 'package.json' = 'package.json';

    if (envVersion && valid(envVersion)) {
      value = envVersion;
      source = 'env';
    } else if (valid(version)) {
      // 环境变量中没有的话，那么从package.json中获取
      value = version;
      source = 'package.json';
    }

    if (!value) {
      return indicator.down<VersionHealthDownAdditionalData>({ error: 'Version not found or not valid semver' });
    }

    return indicator.up<VersionHealthUpAdditionalData>({ value, source });
  }
}
