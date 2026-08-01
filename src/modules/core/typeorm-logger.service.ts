import { Injectable, Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

/**
 * 自定义TypeORM日志服务
 * 整合TypeORM日志和NestJS日志，以在整个程序中实现一致的日志格式和级别
 * Custom TypeORM Logger Service
 * Integrates TypeORM logging with NestJS Logger for consistent logging format
 * and levels across the application.
 */
@Injectable()
// 实现TypeOrmLogger这个接口
export class TypeOrmLoggerService implements TypeOrmLogger {
  // 只读的日志实例
  private readonly logger = new Logger('TypeORM');

  /*
   * 记录查询以及使用的参数
   * @param query 查询
   * @param parameters 参数
   * @param _queryRunner
   */
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const formattedQuery = this.formatQuery(query, parameters);
    // 打印 ‘Query: queryname -- Parameters: [参数jsonstr, 参数jsonstr, ...]’
    this.logger.debug(`Query: ${formattedQuery}`);
  }

  /**
   * 记录查询失败的情况
   */
  logQueryError(error: string | Error, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const formattedQuery = this.formatQuery(query, parameters);
    const errorMessage = error instanceof Error ? error.message : error;
    // Query failed: queryname -- Parameters: [参数jsonstr, 参数jsonstr, ...] | Error: errorMessage
    this.logger.error(`Query failed: ${formattedQuery} | Error: ${errorMessage}`);
  }

  /**
   * 查询速度慢
   */
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const formattedQuery = this.formatQuery(query, parameters);
    // Slow query (time ms): Query: queryname -- Parameters: [参数jsonstr, 参数jsonstr, ...]
    this.logger.warn(`Slow query (${time}ms): ${formattedQuery}`);
  }

  // 记录规则构建
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.logger.log(`Schema build: ${message}`);
  }

  // 记录迁移
  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.logger.log(`Migration: ${message}`);
  }

  // 使用给定的记录器执行记录，或者使用默认记录到控制台，日志有他自己的级别和消息
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
        this.logger.log(message);
        break;
      case 'info':
        this.logger.log(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }

  /**
   * 格式化查询日志
   * @param query 查询
   * @param parameters 参数
   * @returns
   */
  private formatQuery(query: string, parameters?: any[]): string {
    // 如果参数为空，返回query
    if (!parameters || parameters.length === 0) {
      return query;
    }
    // 返回‘queryname -- Parameters: [参数jsonstr, 参数jsonstr, ...]’
    return `${query} -- Parameters: [${parameters.map((p) => JSON.stringify(p)).join(', ')}]`;
  }
}
