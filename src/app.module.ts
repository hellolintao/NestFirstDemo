/**
 * 程序的主模块，主要工作是导入其他各种各样的模块
 * Main application module 主程序模块
 * Configures global modules, database connections, and imports feature modules. 配置全局的模块、数据库连接、导入功能模块
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { CacheModule } from '@nestjs/cache-manager';

import { validate } from './config/configuration';
import { CoreModule } from './modules/core/core.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ReferenceDataModule } from './modules/reference-data/reference-data.module';
import { TypeOrmLoggerService } from './modules/core/typeorm-logger.service';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({ isGlobal: true, validate }),
    // 日志模块
    LoggerModule.forRootAsync({
      imports: [ConfigModule], // 导入配置模块
      inject: [ConfigService], // 注入配置服务
      useFactory: (configService: ConfigService) => ({
        // 利用工厂函数，得到模块实例
        pinoHttp: {
          level: configService.get<string>('LOGGING_LEVEL'),
          transport:
            process.env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    ignore: 'pid,hostname,context,req,res,responseTime',
                    messageFormat:
                      '{if req.method}{req.method}{req.url} {end}{if context}[{context}] {end}{msg}{if responseTime} {responseTime}ms{end}',
                  },
                }
              : undefined,
        },
      }),
    }),
    // 缓存模块，默认五秒缓存一次
    CacheModule.register({ isGlobal: true, ttl: 5000 }), // Cache for 5 seconds by default
    // 日程表模块
    ScheduleModule.forRoot(),
    // 核心模块（自定义）
    CoreModule,
    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, CoreModule],
      useFactory: (configService: ConfigService, typeOrmLogger: TypeOrmLoggerService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_DATABASE'),
        ssl: configService.get('DB_SSL') ? { rejectUnauthorized: false } : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: configService.get('DB_MIGRATIONS_RUN'), // Automatically run migrations on startup
        synchronize: false, // Set to false in production, use migrations instead
        logging: configService.get('DB_LOGGING'),
        logger: typeOrmLogger,
        extra: {
          min: 5, // minimum number of clients in the pool
          max: 10, // maximum number of clients in the pool
          idleTimeoutMillis: 30000, // close idle clients after 30 seconds
          connectionTimeoutMillis: 10000, // return an error after 10 seconds if connection could not be established
        },
      }),
      inject: [ConfigService, TypeOrmLoggerService],
    }),
    // 数据库模块（只读）
    TypeOrmModule.forRootAsync({
      name: 'read-only',
      imports: [ConfigModule, CoreModule],
      useFactory: (configService: ConfigService, typeOrmLogger: TypeOrmLoggerService) => {
        const readOnlyHost = configService.get<string>('DB_HOST_READ_ONLY') || configService.get<string>('DB_HOST')!;
        return {
          type: 'postgres',
          host: readOnlyHost,
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASS'),
          database: configService.get('DB_DATABASE'),
          ssl: configService.get('DB_SSL') ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: configService.get('DB_LOGGING'),
          logger: typeOrmLogger,
          extra: {
            min: 5,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          },
        };
      },
      inject: [ConfigService, TypeOrmLoggerService],
    }),
    // 任务模块（自定义）
    TasksModule,
    // 健康模块（自定义）
    HealthModule,
    // 鉴权模块（自定义）
    AuthModule,
    // 用户模块（自定义）
    UsersModule,
    // 引用数据模块（自定义）
    ReferenceDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
