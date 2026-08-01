# NestJS Starter

[![Continuous Integration](https://github.com/leanstacks/nestjs-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/leanstacks/nestjs-starter/actions/workflows/ci.yml)
&nbsp;
&nbsp;
[![Code Quality](https://github.com/leanstacks/nestjs-starter/actions/workflows/code-quality.yml/badge.svg)](https://github.com/leanstacks/nestjs-starter/actions/workflows/code-quality.yml)

## Overview

This is a starter kit for creating new NestJS application components. It provides efficient and scalable server-side applications using the [NestJS](https://nestjs.com/) framework and TypeScript with a well-structured foundation for rapid development.

## Features

This starter project implements production-ready NestJS patterns and features. Use them as-is, extend them, or remove them based on your specific requirements.

### Core Application Features 应用程序核心特性

- **Modular Architecture（模块化结构）** - Feature-based module organization (Tasks, Users, Auth, Reference Data, Health) 基于特征的模块化组织（任务、用户、授权、参考数据、健康）
- **RESTful API Endpoints（RESTful API 端点）** - Fully functional CRUD operations with validation 具备验证功能的全功能CRUD操作
- **API Versioning（API 版本控制）** - URI-based versioning supporting multiple API versions 基于URI的多版本控制，支持多版本API
- **Request Validation（请求验证）** - Automatic validation using `class-validator` and DTOs 使用`class-validator`和DTO自动化验证
- **Pagination（分页）** - Built-in pagination support for list endpoints 内建了对列表端口的分页支持
- **Caching（缓存）** - In-memory caching with configurable TTL for improved performance 利用TTL（生存时间）配置内存缓存，提高性能
- **Scheduled Tasks（任务调度）** - Cron-based task scheduling for background operations 针对后台操作提供了基于Cron的任务调度

### Database 数据库 & Persistence 持久性

- **TypeORM Integration（TypeORM整合）** - PostgreSQL database with TypeORM for entity management 使用TypeORM进行实体管理PostgreSQL数据库
- **Database Migrations（数据库迁移）** - Version-controlled schema changes and data seeding 版本控制下的模式变更和数据播种
- **Read Replicas（只读副本）** - Support for read-only database connections to reduce load 对只读数据库提供支持以减少负载
- **Entity Relationships（实体关系）** - Demonstrates foreign key relationships and data associations 展示外键关系和数据关联
- **Connection Pooling（连接池）** - Optimized database connection management 优化数据库连接管理

### Authentication 认证 & Security 安全

- **JWT Authentication（JWT 认证）** - Token-based authentication using JSON Web Tokens 基于JSON Web Tokens令牌的认证
- **Passport Integration（护照集成）** - Strategy-based authentication with Passport.js (JWT and Local strategies) 利用Passport.js实现基于策略的认证（JWT和本地策略）
- **Global Auth Guard（全局权限守卫）** - Default protection for all endpoints with opt-out using `@Public()` decorator 默认使用`@Public()`装饰器保护全部端口，并允许退出
- **Password Hashing（密码哈希化）** - Secure password storage using bcrypt 使用bcrypt安全化密码存储
- **User Management（用户管理）** - Complete user registration and profile management 完整的用户注册和个人信息管理
- **Custom Decorators（自定义装饰器）** - `@AuthUser()` decorator for accessing authenticated user context `@AuthUser()`自定义装饰器用来连接认证过的用户上下文
- **Security Middleware（安全性中间件）** - Helmet for HTTP header security HTTP头部安全头盔
- **CORS Configuration（跨域配置）** - Cross-origin resource sharing with configurable origins 具备可配置源的跨域资源共享

### Logging 日志 & Monitoring监控

- **Structured Logging （结构化日志）** - Production-ready JSON logging with Pino 使用Pino实现生产环境的JSON日志
- **Formatted Development Logs （格式化的开发日志）** - Pretty-printed logs for local development 为本地开发没话日志
- **Configurable Log Levels （可配置的日志等级）** - Environment-specific logging verbosity 特定环境下的日志记冗余
- **SQL Query Logging （SQL查询日志）** - Optional TypeORM query logging for debugging 用于调试的可选的TypeORM查询日志
- **Custom TypeORM Logger （自定义TypeORM日志）** - Integration between TypeORM and Pino logging 整合TypeORM和Pino日志

### Health Checks 健康检查 & Monitoring 监控

- **Health Check Endpoints （端口安全检查）** - Built-in health monitoring using `@nestjs/terminus` 使用`@nestjs/terminus`内建的安全监控
- **Database Health Checks （数据库安全检查）** - Validates database connectivity 验证数据库连接
- **Version Information （版本信息）** - Application version tracking and reporting 应用程序版本跟踪和报告
- **Custom Health Indicators （自定义健康指标）** - Extensible health check framework 可拓展的健康检查框架

### API Documentation API文档

- **Swagger/OpenAPI** - Automatic API documentation generation 自动生成API文档
- **Interactive API Explorer（ 交互式的API浏览器）** - Swagger UI for testing endpoints 用户测试端口的Swagger的UI
- **Schema Documentation （架构文档）** - Comprehensive DTO and entity documentation 全部的DTO和实体文档
- **Authentication in Swagger （Swagger中的权限）** - Bearer token support in API docs 支持在 API 文档中负载token

### Configuration Management 配置管理

- **Environment Variables （环境变量）** - Centralized configuration using `@nestjs/config` 使用`@nestjs/config`集中式配置
- **Type-Safe Config （类型安全配置）** - TypeScript interfaces for configuration validation 用于配置验证的ts接口
- **Schema Validation （模式验证）** - Environment variable validation on startup 在启动时验证环境变量
- **Multiple Environments （多环境）** - Support for development, quality, staging, and production configurations 支持开发、质量、测试和生产配置

### DevOps 开发运维 & Infrastructure 基础设施

- **Docker Support （Docker支持）** - Multi-stage Dockerfile for optimized container images 用于优化容器镜像的多阶段docker文件
- **Docker Compose** - Local development setup with PostgreSQL and pgAdmin 使用PostgreSQL和pgAdmin进行本地化开发启动
- **AWS CDK Infrastructure （Amazon Web Services Cloud Development Kit 基础设施）** - Complete infrastructure as code using TypeScript 使用TS将基础设置编码为代码
  - Aurora Serverless v2 PostgreSQL database
  - ECS Fargate compute with autoscaling 具备自动扩展的ECS Fargate计算（亚马逊提供的计算引擎）
  - Application Load Balancer with health checks 带有健康检查的应用负载均衡器
  - ECR for container image storage 用于存储容器镜像的ECR（Elastic Container Registry）
  - Route 53 DNS and SSL certificates 路由 53 DNS和SLL证书
  - Scheduled task infrastructure for cron jobs 用于cron作业的计划任务的基础设施
- **GitHub Actions** - CI/CD pipelines for testing, building, and deployment 用于测试、构建、部署的持续集成/持续交付的流水线
- **Comprehensive Documentation（全面的文档）** - Detailed guides for configuration, infrastructure, and Docker 配置、基础设置和Docker的详细的指南

### Code Quality 代码质量 & Testing 测试

- **Unit Tests（单元测试）** - Comprehensive test coverage using Jest 使用Jest全面的测试覆盖
- **End-to-End Tests（端对端测试）** - Integration tests for API endpoints 用于API端口的集成测试
- **Pre-commit Hooks（预提交钩子）** - Husky for automated linting and formatting 用于自动代码检查和格式化的Husky
- **ESLint** - Code quality enforcement with NestJS-specific rules 使用 NestJS-specific 规则增强代码质量
- **Prettier** - Consistent code formatting 一致的代码格式
- **Coverage Reports 覆盖率报告** - Test coverage tracking and reporting 测试覆盖率跟踪和报告

## Getting Started 启动项目

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

- Copy `.env.example` to `.env` and adjust values as needed.
- See the [Configuration Guide](docs/configuration-guide.md) for details.

3. **Run the application:**

```bash
npm run start
```

## Available Scripts 可用脚本

| Script                | Description                                  |
| --------------------- | -------------------------------------------- |
| npm run build         | Compile the TypeScript source code           |
| npm run clean         | Remove build output and temporary files      |
| npm run lint          | Run ESLint to check code quality             |
| npm run lint:fix      | Fix code quality issues with ESLint          |
| npm run format        | Format code using Prettier                   |
| npm run format:check  | Check code formatting without changing files |
| npm run start         | Start the application (development)          |
| npm run start:dev     | Start in watch mode                          |
| npm run start:prod    | Start in production mode                     |
| npm run test          | Run unit tests                               |
| npm run test:e2e      | Run end-to-end tests                         |
| npm run test:coverage | Run test coverage                            |

## Project Structure 项目结构

```
├── .github/                             # GitHub workflows and configuration
|
├── docs/                                # Project documentation
|  ├── configuration-guide.md            # Configuration guide
|  └── devops-guide.md                   # DevOps guide
|
├── infrastructure/                      # AWS CDK Infrastructure as Code
│   ├── stacks/                          # AWS CDK stacks
|   └── app.ts                           # AWS CDK application
|
├── src/                                 # Main application source code
│   ├── app.module.ts                    # App module
│   ├── main.ts                          # Application entry point
│   ├── modules/
│   │   └── tasks/                       # Example feature module
│   │       ├── tasks.module.ts          # Tasks module definition
│   │       ├── tasks.controller.ts      # Tasks controller
│   │       ├── tasks.controller.spec.ts # Tasks controller unit tests
│   │       ├── tasks.service.ts         # Tasks service
│   │       ├── tasks.service.spec.ts    # Tasks service unit tests
│   │       ├── dto/                     # DTOs for tasks
│   │       └── entities/                # Entities for tasks
│   └── config/                          # Configuration-related code
│       └── configuration.ts             # Configuration loader
├── test/                                # End-to-end tests
│   ├── tasks.e2e-spec.ts                # E2E test spec
│   └── jest-e2e.json                    # Jest E2E config
|
├── .env.example                         # Example environment variables
├── package.json                         # Project metadata and scripts
├── tsconfig.json                        # TypeScript configuration
├── nest-cli.json                        # NestJS CLI configuration
└── README.md                            # Project documentation
```

## Documentation Hub 文档中心

For all guides and references—including configuration, Docker, DevOps, and API documentation—see the [Documentation Table of Contents](docs/README.md).

## Additional Information 附加的信息

For more information, see the [NestJS Documentation](https://docs.nestjs.com/).

## License 许可证

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
