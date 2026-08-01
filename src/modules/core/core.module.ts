/**
 * 核心模块
 * 提供由AppModule一次性导入的，程序范围内的服务和基础设施组件
 * Core Module
 * Provides application-wide services and infrastructure components imported once
 * by the AppModule.
 */
import { Module } from '@nestjs/common';

// 日志打印服务
import { TypeOrmLoggerService } from './typeorm-logger.service';

@Module({
  providers: [TypeOrmLoggerService],
  exports: [TypeOrmLoggerService],
})
export class CoreModule {}
