/**
 * 这里是程序的入口，它提供了：
 * - 创建程序实例
 * - 启用URI版本控制
 * - 增加helmet中间件
 * - 配置跨域
 * - 配置日志
 * - 配置Swagger
 * - 启动项目
 */

import { NestFactory } from '@nestjs/core'; // Nest工厂，创建实例的
import { ConfigService } from '@nestjs/config'; // 获取配置的
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // swagger相关
import { Logger } from 'nestjs-pino'; // 日志相关
import { VersioningType } from '@nestjs/common'; // 通用功能，版本类型
import helmet from 'helmet'; // 中间件、安全头盔

import { AppModule } from './app.module'; // App模型
import { Config } from './config/configuration'; // 配置

// 启动引导程序
async function bootstrap() {
  // 创建NestJs实例，使用AppModule模块
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // 如果启用，日志将会被缓存
  });

  // 启用URI版本控制
  // Enable URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // 检索配置服务来连接到程序设置
  // Retrieve configuration service to access application settings
  const configService = app.get(ConfigService<Config>);

  // 使用安全中间件，helmet可以预防很多常见的http漏洞攻击
  // Apply security middleware
  app.use(helmet()); // Must be before any other middleware

  // 启动允许的域名
  app.enableCors({
    origin: configService.get<string | string[]>('CORS_ALLOWED_ORIGIN')!, // 这个叹号是一个非空断言操作符号，提示ts确定该值一定不是null或者undefined
  });

  // 使用Pino logger实现结构化日志
  // Use the Pino logger for structured logging
  app.useLogger(app.get(Logger));

  // 设置Swagger
  // Set up Swagger for API documentation
  const documentBuilder = new DocumentBuilder()
    .setTitle('NestJS Starter')
    .setDescription('API documentation for the NestJS Starter application.')
    .setVersion('1.0')
    .addGlobalResponse(
      { status: 400, description: 'Bad Request' },
      { status: 500, description: 'Internal Server Error' },
    )
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('apidoc', app, document);

  // 启动程序
  // Start the application and listen on the configured port
  await app.listen(configService.get<number>('APP_PORT')!);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
