/**
 * TypeORM Migration Configuration
 * ------------------------------
 * This file sets up the TypeORM DataSource for running migrations only.
 *
 * - Not used by the NestJS application runtime.
 * - Used by TypeORM CLI and scripts for database migrations.
 * - Loads environment variables using dotenv and @nestjs/config.
 * - Uses ConfigService to read DB connection settings (host, port, user, password, database).
 * - Configures entities and migrations paths for TypeORM.
 * - Synchronize is disabled for safety in production.
 * - Logging is enabled for debugging queries and migrations.
 *
 * Usage:
 *   - Update your .env file with DB_* variables as needed.
 *   - Entities should be placed in src/modules/[feature]/entities/.
 *   - Migrations should be placed in src/migrations/.
 *   - This config is imported by TypeORM CLI for migration commands.
 *   - See package.json scripts for migration commands.
 */

/**
 * TypeORM 迁移配置
 * ------------------------------
 * 这个文件仅仅是为了运行TypeORM数据资源迁移而配置
 *
 * - 它不被NestJs应用程序运行时所使用
 * - 它被 TypeORM CLI 和用户数据库迁移的脚本使用
 * - 使用 dotenv 和 @nestjs/config加载环境变量配置
 * - 使用 ConfigService 来阅读数据库连接设置 (host, port, user, password, database).
 * - 用于TypeORM的配置实体和迁移路径
 * - 出于安全，在生产中禁止同步
 * - 启用日志，以调试查询和迁移
 *
 * 用法:
 *   - 根据需要，更新.env文件中DB_开始的变量
 *   - 数据实体应该被放置在src/modules/[feature]/entities/中
 *   - 迁移应该方式在src/migrations/.
 *   - 这个配置被 TypeORM CLI导入，用于迁移命令
 *   - 查看 package.json，查看迁移命令
 */
import { DataSource } from 'typeorm'; // DataSource是数据库的客户端、总管道，所有的数据库操作都通过它来执行
import { ConfigService } from '@nestjs/config'; // @nestjs/config 配置管理模块，ConfigService主要是用来读取配置值的
import { config } from 'dotenv'; // dotenv主要是从.env文件中加载环境变量到process.env的

// Load environment variables
// 加载环境变量
config();

const configService = new ConfigService();

// 创建这个客户端的实例
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USER', 'nestuser'),
  password: configService.get('DB_PASS', 'nestpassword'),
  database: configService.get('DB_DATABASE', 'nestdb'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // __dirname表示当前的文件目录路径
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // 同步
  logging: true, // 日志
});
