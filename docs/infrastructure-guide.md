# Infrastructure Guide 基础设施指南

This guide provides a comprehensive overview of the AWS infrastructure for the NestJS Starter backend application, including architectural decisions, deployment instructions, and operational considerations.

此指南针对NestJS Starter后台应用提供了全面的关于AWS基础设施的概览，包括架构决策、部署说明和注意事项。

> **Note:** This infrastructure provisions only backend/API components. There is no presentation tier (e.g., web frontend, CloudFront) included. All resources are for backend services and APIs.

> **Note:** 此基础设置仅仅规定了后台组件，没有包括其他演示层级（例如前端、云端），全部的字段都是后台服务和API的。

## Table of Contents 内容表格

1. [Architecture Overview 架构概览](#architecture-overview)
2. [Infrastructure Components 基础设施组件](#infrastructure-components)
3. [Deployment Process 部署进程](#deployment-process)
4. [Environment Management 环境管理](#environment-management)
5. [Security Model 安全模型](#security-model)
6. [Cost Optimization 成本优化](#cost-optimization)
7. [Monitoring and Observability 监控与可检测行](#monitoring-and-observability)
8. [Disaster Recovery 灾难恢复](#disaster-recovery)
9. [Troubleshooting 问题排查](#troubleshooting)
10. [Best Practices 最佳实践](#best-practices)

## Architecture Overview 架构预览

The NestJS Starter backend application is deployed on AWS using a modern, serverless-first architecture designed for cost optimization, scalability, and maintainability. The infrastructure is organized into five logical stacks:

此NestJS Starter后台应用程序为了优化成本、可拓展性和可维护性，使用现代的、serverless先行的架构设计，并部署在AWS上。此基础设施被组织进五个逻辑栈中

### High-Level Architecture 高层架构

```
┌─────────────────┐    ┌───────────────────┐    ┌────────────────────┐    ┌─────────────────┐
│  Application    │    │      Data         │    │   Container Image  │    │   Scheduled     │
│      Tier       │    │      Tier         │    │      Registry      │    │     Tasks       │
├─────────────────┤    ├───────────────────┤    ├────────────────────┤    ├─────────────────┤
│ Route 53        │    │ Aurora Serverless │    │ Amazon ECR         │    │ ECS Fargate     │
│ SSL Certificate │    │ v2 PostgreSQL     │    │ (ECR Stack)        │    │ (No Load        │
│ Load Balancer   │    │ Secrets Manager   │    │                    │    │  Balancer)      │
│ ECS Fargate     │    │                   │    │                    │    │ Background Jobs │
└─────────────────┘    └───────────────────┘    └────────────────────┘    └─────────────────┘
```

- 应用程序层
  - 域名服务
  - 证书服务
  - 负载均衡器
  - 容器运行平台
- 数据库
  - Aurora Serverless v2 PostgreSQL（数据库）
  - 密钥管理服务
- 容器镜像注册表
  - Amazon ECR (ECR Stack)（容器镜像仓库）
- 计划任务表
  - 无负载均衡的后台服务

> **Note:** There is no presentation tier (such as CloudFront or web frontend) in this architecture. All components are backend/API only.

> **Note:** 此架构中无其他演示层（例如云端和前端），全部组件都是后台和API的。

### Design Principles 设计原则

1. **Serverless First**: Minimize operational overhead with managed services
2. **Cost Optimization**: Right-sized resources with autoscaling capabilities
3. **Security by Design**: Zero-trust networking with least privilege access
4. **Infrastructure as Code**: All infrastructure defined in CDK TypeScript
5. **Multi-Environment**: Supports dev, qa, and production environments

###

1. **Serverless 先行**: 通过托管服务最小化运行开销
2. **成本优化**: 具备自动扩展能力的适度资源
3. **通过设计的安全性**: 最小的权限下访问零信任网络
4. **基础设施即代码**: 全部的基础设施都在CDK中使用TS定义
5. **多环境**: 支持开发、测试和生产环境

## Infrastructure Components 基础设施组件

- 网络栈
- 数据库栈
- ECR栈
- 计算栈
- 计划任务栈

### Network Stack (`network.stack.ts`) 网络栈

**Purpose**: Provides foundational networking, DNS, and SSL capabilities.

**目标**: 提供基础的网络、DNS和SSL能力

**Key Resources**:

- **VPC Virtual Private**: Existing VPC imported by ID for network isolation
- **Route 53 Hosted Zone**: Existing zone for DNS management
- **SSL Certificate**: Existing ACM certificate for HTTPS termination
- **DNS Alias**: A-record pointing to the Application Load Balancer

**关键资源**:

- **虚拟私有云**: 通过ID为网络隔离导入现有的VPC（虚拟私有云）
- **Route 53托管区域**: 为DNS管理使用现有的区域
- **SSL证书**: 现有为HTTPS终端提供的ACM（AWS Certificate Manager）证书
- **DNS别名**: 指向应用程序负载均衡的A记录

**Configuration**:

```typescript
// Required environment variables 必要的环境变量
CDK_HOSTED_ZONE_ID=Z1234567890ABC
CDK_HOSTED_ZONE_NAME=example.com
CDK_CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/...
CDK_DOMAIN_NAME=nestjs-starter-api
```

### Database Stack (`database.stack.ts`) 数据库栈

**Purpose**: Provides managed PostgreSQL database with automatic scaling.

**目标**: Provides 提供具备自动扩展功能的托管的PostgreSQL数据库

**Key Resources**:

- **Aurora Serverless v2**: PostgreSQL 17.5 with configurable ACU capacity
- **Security Group**: Restricts access to port 5432 from application only
- **Subnet Group**: Database deployed in private subnets
- **Secrets Manager**: Automatic credential generation and rotation

**关键资源**:

- **Aurora Serverless v2 （亚马逊的一个数据库）**: 具备ACU配置能力的PostgreSQL 17.5
- **安全组**: 限制应用程序只能通过5432端口访问
- **子网络组**: 在私有子网上部署数据库
- **密钥管理**: 自动化的证书创建和轮转

**Configuration**:

```typescript
// Database environment variables
CDK_DATABASE_NAME = nestjs_starter;
CDK_DATABASE_USERNAME = postgres;
CDK_DATABASE_MIN_CAPACITY = 0.5; // Minimum ACUs (configurable) 可配置的最小的Aurora容量单元数
CDK_DATABASE_MAX_CAPACITY = 1; // Maximum ACUs (configurable)
CDK_DATABASE_READ_REPLICA = false; // Enable read replica (default: false)
```

**Read Replica Support**:

**支持只读副本**:

When `CDK_DATABASE_READ_REPLICA=true`:

- Creates a serverless v2 reader instance in the Aurora cluster
- Stores the read endpoint hostname in a separate AWS Secrets Manager secret
- Passes the read replica hostname to the application as `DB_HOST_READ_ONLY`
- Application creates a read-only TypeORM data source using the replica endpoint
- Falls back to primary host if `DB_HOST_READ_ONLY` is not provided

当有这个配置的时候`CDK_DATABASE_READ_REPLICA=true`

- 在Aurora cluster创建serverless v2只读实例
- 在分离式的AWS密钥管理器中保存只读指针的主机名
- 将只读副本主机名作为 `DB_HOST_READ_ONLY` 传递给应用程序
- 程序使用副本接口创建一个只读的TypeORM数据资源
- 如果没有提供 `DB_HOST_READ_ONLY` 那么退回到主主机

When `CDK_DATABASE_READ_REPLICA=false` (default):

- No reader instances are created (cost optimization)
- Application uses the primary database for all operations

当 `CDK_DATABASE_READ_REPLICA=false` (default):

- 没有阅读实例被创建
- 应用程序为全部操作使用主数据库

**Cost Optimization Features**:

- Configurable minimum capacity: 0.5-16 ACUs (default: 0.5)
- Configurable maximum capacity: 1-16 ACUs (default: 1)
- Automatic pausing when inactive (scale-to-zero capability)
- Backup retention: 7 days (production) / 1 day (non-production)
- Read replicas are optional and can be disabled for non-production environments

**成本优化特性**：

- 配置最小容量
- 配置最大容量
- 当不活跃的时候自动暂停
- 备份（生产环境7天，非生产环境1天）
- 支付副本是可选项，并且可以在非生产环境被关闭

**Connection Details**:

**连接细节**：

```typescript
// Environment variables injected into containers 环境变量注入到容器中
DB_HOST: cluster.clusterEndpoint.hostname
DB_PORT: 5432
DB_USERNAME: postgres (from secrets)
DB_PASSWORD: auto-generated (from secrets)
DB_DATABASE: nestjs_starter
```

### ECR Stack (`ecr.stack.ts`) ECR栈

**Purpose**: Manages the Amazon Elastic Container Registry (ECR) for storing and scanning application container images.

**目的**: 管理用于存储和扫描应用程序镜像的亚马逊弹性容器注册表

**Key Resources**:

- **ECR Repository**: `${appName}` (named per environment)
- **Image Scanning**: Enabled on push for vulnerability detection
- **Tag Mutability**: Mutable tags for development workflows
- **Removal Policy**: Retain in production, destroy in non-prod environments
- **Outputs**: Exports repository URI, name, and ARN for use in other stacks

**关键资源**：

- **ECR仓库**: 为每个环境命名
- **镜像扫描**: 开启在推送时的漏洞检测
- **可变性标签**: 开发工作流的可变标签
- **移除策略**: 在生产环境中保留，在非生产环境中销毁
- **Outputs 输出**: 导出仓库的URI、名称和ARN以在其他栈中使用

### Compute Stack (`compute.stack.ts`) 计算栈

**Purpose**: Hosts the NestJS application using containerized microservices.

**目的**: 使用容器化的微服务托管NestJS程序

**Key Resources**:

- **ECS Cluster**: Managed ECS cluster with container insights
- **Task Definition 任务定义**: Fargate task with configurable CPU and memory
- **Service 服务**: Maintains desired instance count with rolling deployments
- **Auto Scaling 自动拓展**: CPU-based scaling (50% threshold, configurable min/max instances)
- **Application Load Balancer 应用程序负载均衡**: Internet-facing with HTTPS termination
- **Target Group 目标组**: Health checks on `/v1/health` endpoint
- **Listeners 许可证**:
  - Port 443 (HTTPS): Routes to application
  - Port 80 (HTTP): Redirects to HTTPS
- **Security Groups 安全组**: Restrictive ingress/egress rules
- **Subnets 子网**: Application deployed in private subnets with NAT Gateway access

**关键资源**：

- **ECS集群**: 具备容器洞察力的托管ECS集群
- **任务定义**: 带有可配置CPU和内存的Fargate任务
- **Service 服务**: 通过滚动部署保持期望的实例数
- **Auto Scaling 自动拓展**: 基于CPU的拓展（50%阈值，配置最大/最小实例）
- **Application Load Balancer 应用程序负载均衡**: 使用HTTPS终端面向互联网
- **Target Group 目标组**: 在`/v1/health` 接口进行健康检查
- **Listeners 许可证**:
  - Port 443 (HTTPS): 导航到程序
  - Port 80 (HTTP)： 重定向到HTTPS
- **Security Groups 安全组**: 限制性的出入规则
- **Subnets 子网**: 程序使用NAT（（网络地址转换））网关部署在私有子网上

**Configuration**:

**配置**:

```typescript
// Compute environment variables 计算环境变量
CDK_APP_PORT = 3000;
CDK_APP_LOGGING_LEVEL = debug;
CDK_APP_JWT_EXPIRES_IN = 1h; // JWT token expiration time JWT token过期时间
CDK_TASK_MEMORY_MB = 512; // Task memory in MB (configurable) 任务内存
CDK_TASK_CPU_UNITS = 256; // Task CPU units (configurable) 任务CPU单元
CDK_SERVICE_DESIRED_COUNT = 0; // Initial desired count (configurable) 初始期望计数
CDK_SERVICE_MIN_CAPACITY = 0; // Auto scaling minimum (configurable) 自动拓展最小值
CDK_SERVICE_MAX_CAPACITY = 4; // Auto scaling maximum (configurable) 自动拓展最大值
```

**Environment Variables Injected into Compute Containers**:

**环境变量注入到计算容器中**:

```typescript
// Application environment variables 环境变量
NODE_ENV: 'production';
APP_PORT: '3000';
LOGGING_LEVEL: 'debug'; // or configured level
LOGGING_FORMAT: 'json';
CORS_ALLOWED_ORIGIN: '*'; // or configured origins
JWT_EXPIRES_IN: '1h'; // JWT token expiration from CDK_APP_JWT_EXPIRES_IN

// Secrets from AWS services
DB_HOST: 'cluster endpoint'; // from Aurora Secrets Manager
DB_PORT: '5432'; // from Aurora Secrets Manager
DB_USER: 'postgres'; // from Aurora Secrets Manager
DB_PASS: 'auto-generated'; // from Aurora Secrets Manager
DB_DATABASE: 'nestjs_starter'; // from Aurora Secrets Manager
DB_HOST_READ_ONLY: 'read endpoint'; // from Read Replica Secrets Manager (optional)
JWT_SECRET: 'secure-jwt-secret'; // from Parameter Store: /nestjs-starter/jwt-secret
```

**Note**: `DB_HOST_READ_ONLY` is only injected when `CDK_DATABASE_READ_REPLICA=true` in the infrastructure configuration.

**注意**：只有基础设置配置中`CDK_DATABASE_READ_REPLICA=true`的时候， `DB_HOST_READ_ONLY` 才会注入

### Scheduled Task Stack (`scheduled-task.stack.ts`) 计划任务栈

**Purpose**: Runs background tasks and scheduled jobs using the same application image without HTTP load balancer overhead.

**目标**：在没有HTTP负载均衡的情况下，使用相同的程序镜像运行后台任务和计划工作

**Key Resources**:

- **Task Definition**: Fargate task identical to main application but configured for scheduled tasks
- **ECS Service**: Runs exactly 1 instance (or 0 when disabled) for background job processing
- **Security Group**: Restrictive egress-only rules (no inbound HTTP traffic needed)
- **CloudWatch Log Group**: Separate logging for scheduled task output
- **No Load Balancer**: Direct container execution without HTTP routing

**关键资源**:

- **任务定义**: Fargate 任务与主程序相同，但配置为了计划任务
- **ECS 服务**: 为后台工作进程确切的运行1个实例（不可用时为0）
- **安全组**: 限制仅egress规则（无入站HTTP流量）
- **CloudWatch 日志组**: 对计划任务输出进行分离日志
- **无负载均衡**: 无需HTTP路由即可直接运行容器

**Conditional Deployment**:

- **Resources are only created when `CDK_SCHEDULE_TASK_CLEANUP_CRON` is defined**
- **Service desired count**: 1 when scheduled tasks enabled, 0 when disabled
- **Cost-effective**: No ALB, Target Groups, or HTTP listeners required

**条件部署**:

- **只有当定义了 `CDK_SCHEDULE_TASK_CLEANUP_CRON` 的时候，资源才会被创建**
- **服务期望计数**: 当计划任务可用的时候是1，不可用的时候是0
- **成本效益高**: 无需ALB、目标组或者HTTP监听器

**Configuration**:

```typescript
// Scheduled task environment variables (optional) 可选的任务计划环境变量
CDK_SCHEDULE_TASK_CLEANUP_CRON = '0 2 * * *'; // Daily at 2 AM (optional) 每天上午2点
CDK_SCHEDULER_TASK_MEMORY_MB = 512; // Task memory in MB (default: 512) 任务内存
CDK_SCHEDULER_TASK_CPU_UNITS = 256; // Task CPU units (default: 256) 任务CPU单元
```

**Environment Variables Injected**:

- `SCHEDULE_TASK_CLEANUP_CRON`: Cron expression for task scheduling
- `NODE_ENV=production`: Production mode
- `LOGGING_LEVEL`: Configured logging level
- `LOGGING_FORMAT=json`: JSON logging format
- Database connection secrets (same as main application)

**任务环境变量注入**:

- `SCHEDULE_TASK_CLEANUP_CRON`: 任务计划的Cron表达式
- `NODE_ENV=production`: Production mode 生产模式
- `LOGGING_LEVEL`: 配置日志详细水平
- `LOGGING_FORMAT=json`: JSON日志格式
- 数据库连接密钥（同主程序）

**Use Cases**:

- Database cleanup tasks
- Data aggregation jobs
- Batch processing operations
- Maintenance routines
- Report generation

**用例**:

- 数据库清理计划
- 数据聚合工作
- 批处理操作
- 维护程序（常规维护）
- 生成报告

## Deployment Process 部署进程

### Prerequisites

1. **AWS Account Setup**:
   - AWS CLI configured with appropriate credentials
   - CDK bootstrap completed in target account/region

2. **Existing Resources**:
   - VPC with public and private subnets
   - Route 53 hosted zone
   - SSL certificate in ACM

3. **Required Secrets**:
   - JWT secret parameter must be created manually in AWS Systems Manager Parameter Store:
     ```bash
     aws ssm put-parameter \
       --name "/nestjs-starter/jwt-secret" \
       --type "SecureString" \
       --value "your-secure-jwt-secret-key"
     ```
4. **Local Environment**:
   - Node.js (version in `.nvmrc`)
   - AWS CDK CLI installed globally

### 前置条件

1. **AWS账户起步**:
   - AWS CLI configured with appropriate credentials
   - CDK bootstrap completed in target account/region
   - 使用恰当的证书配置AWS CLI
   - CDK引导程序在目标账户/区域启动完成

2. **现有资源**:
   - 公网和私网下的VPC
   - Route 53主机区域
   - ACM ACM内的SSL证书

3. **必要的密钥**:
   - JWT密钥参数必须手动的在AWS系统管理参数中心被创建
     ```bash
     aws ssm put-parameter \
       --name "/nestjs-starter/jwt-secret" \
       --type "SecureString" \
       --value "your-secure-jwt-secret-key"
     ```

4. **本地环境**:
   - Node.js (version in `.nvmrc`)
   - 全局安装AWS CDK CLI

### Step-by-Step Deployment

1. **Environment Configuration**:

   ```bash
   cd infrastructure
   cp .env.example .env
   # Edit .env with your specific values
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Synthesize Templates**:

   ```bash
   npm run synth
   ```

4. **Deploy Infrastructure**:

   ```bash
   npm run deploy
   ```

5. **Verify Deployment**:
   - Check AWS Console for created resources
   - Test application URL: `https://nestjs-starter-api.example.com`

### 一步步开发

1. **环境配置**:

   ```bash
   cd infrastructure
   cp .env.example .env
   # Edit .env with your specific values
   ```

2. **安装依赖**:

   ```bash
   npm install
   ```

3. **整合模板**:

   ```bash
   npm run synth
   ```

4. **部署基础设施**:

   ```bash
   npm run deploy
   ```

5. **部署验证**:
   - 为创建资源检查AWS控制台
   - 测试应用 URL: `https://nestjs-starter-api.example.com`

### Deployment Order & Stack Dependencies

The CDK automatically handles dependencies, but the logical order is:

1. **Network Stack**: Sets up VPC references and DNS
2. **Database Stack**: Creates Aurora cluster in VPC
3. **ECR Stack**: Creates ECR repository for container images
4. **Compute Stack**: Deploys application with database connectivity and references ECR for images
5. **Scheduled Task Stack**: Deploys background task service using compute cluster and ECR images

**Stack Dependency Diagram:**

```
Network Stack
   ↓
Database Stack
   ↓
ECR Stack
   ↓
Compute Stack
   ↓
Scheduled Task Stack
```

### 部署顺序 & 依赖栈

CDK自动化处理依赖，但是逻辑上的顺序是：

1. **网络栈**: 设置VPC引用和DNS
2. **数据库栈**: 在VPC中创建Aurora集群
3. **ECR栈**: 为容器镜像创建ECR仓库
4. **计算栈**: 部署具有数据库连接的应用程序，并且从镜像中获取ECR引用
5. **计划任务栈**: 使用计算集群化ECR镜像部署后台任务服务

**依赖栈图:**

```
网络 Stack
   ↓
数据库 Stack
   ↓
ECR Stack
   ↓
计算 Stack
   ↓
计划任务 Stack
```

## Resource Configuration 资源配置

### Sizing Recommendations 尺寸建议

The infrastructure supports configurable resource allocation to match workload requirements and optimize costs:

基础设置的支持配置的资源分配，要与工作必要和成本优化相匹配

#### Development Environment 开发环境下的配置

```bash
# Database - Minimal cost configuration
CDK_DATABASE_MIN_CAPACITY=0.5
CDK_DATABASE_MAX_CAPACITY=1

# Compute - Minimal resource configuration
CDK_TASK_MEMORY_MB=512
CDK_TASK_CPU_UNITS=256
CDK_SERVICE_DESIRED_COUNT=0      # Start with 0 to save costs
CDK_SERVICE_MIN_CAPACITY=0
CDK_SERVICE_MAX_CAPACITY=2
```

#### Staging/QA Environment 测试环境下的配置

```bash
# Database - Light production load
CDK_DATABASE_MIN_CAPACITY=0.5
CDK_DATABASE_MAX_CAPACITY=2

# Compute - Higher availability
CDK_TASK_MEMORY_MB=1024
CDK_TASK_CPU_UNITS=512
CDK_SERVICE_DESIRED_COUNT=1
CDK_SERVICE_MIN_CAPACITY=1
CDK_SERVICE_MAX_CAPACITY=4
```

#### Production Environment 生产环境下的配置

```bash
# Database - Production capacity
CDK_DATABASE_MIN_CAPACITY=1
CDK_DATABASE_MAX_CAPACITY=8

# Compute - High availability and performance
CDK_TASK_MEMORY_MB=2048
CDK_TASK_CPU_UNITS=1024
CDK_SERVICE_DESIRED_COUNT=2
CDK_SERVICE_MIN_CAPACITY=2
CDK_SERVICE_MAX_CAPACITY=10
```

### Performance Considerations 性能注意事项

- **CPU/Memory Ratio**: Maintain 1:2 ratio (e.g., 512 CPU with 1024 MB memory)
- **Database ACUs**: 1 ACU = 2 GB RAM + proportional CPU and networking
- **Auto Scaling**: Set appropriate min/max to handle traffic spikes while controlling costs
- **Health Checks**: Ensure adequate memory for application startup and health check responsiveness

- **CPU/Memory 比率**: 主要是1:2 (e.g., 512 CPU with 1024 MB memory)
- **数据库 ACUs**: 1 ACU = 2 GB RAM + 成比例的 CPU and 网络
- **自动拓展**: 设置合适的min/max 来处理流量峰值以便控制成本
- **健康检查**: 确保有足够的内存用于启动应用程序和健康检查响应

## Environment Management 环境管理

### Environment Variables 环境变量

All configuration uses environment variables prefixed with `CDK_`:

所有的环境变量配置都是`CDK_`的前缀

#### Core Infrastructure Variables 核心基础设施变量

| Variable          | Purpose          | Example            | Required |
| ----------------- | ---------------- | ------------------ | -------- |
| `CDK_ACCOUNT`     | AWS Account ID   | `123456789012`     | Optional |
| `CDK_REGION`      | AWS Region       | `us-east-1`        | Optional |
| `CDK_ENVIRONMENT` | Environment name | `dev`, `qa`, `prd` | Yes      |

#### Network & Security Variables 网络和安全变量

| Variable               | Purpose               | Example                        | Required |
| ---------------------- | --------------------- | ------------------------------ | -------- |
| `CDK_HOSTED_ZONE_ID`   | Route 53 zone ID      | `Z1234567890ABC`               | Yes      |
| `CDK_HOSTED_ZONE_NAME` | Route 53 zone name    | `example.com`                  | Yes      |
| `CDK_DOMAIN_NAME`      | Application subdomain | `nestjs-starter-api`           | Yes      |
| `CDK_CERTIFICATE_ARN`  | SSL certificate ARN   | `arn:aws:acm:us-east-1:123...` | Yes      |

#### Application Variables 应用程序变量

| Variable                      | Purpose              | Default          | Example                                 |
| ----------------------------- | -------------------- | ---------------- | --------------------------------------- |
| `CDK_APP_NAME`                | Application name     | `nestjs-starter` | `my-app`                                |
| `CDK_APP_PORT`                | Application port     | `3000`           | `3000`                                  |
| `CDK_APP_LOGGING_LEVEL`       | Log level            | `info`           | `debug`                                 |
| `CDK_APP_CORS_ALLOWED_ORIGIN` | CORS allowed origins | `*`              | `https://app.com,http://localhost:3000` |
| `CDK_APP_JWT_EXPIRES_IN`      | JWT token expiration | `1h`             | `2h`, `30m`, `7d`                       |

#### Database Variables 数据库变量

| Variable                    | Purpose             | Default          | Range      | Example    |
| --------------------------- | ------------------- | ---------------- | ---------- | ---------- |
| `CDK_DATABASE_NAME`         | Database name       | `nestjs_starter` | -          | `myapp_db` |
| `CDK_DATABASE_USERNAME`     | Database username   | `postgres`       | -          | `admin`    |
| `CDK_DATABASE_MIN_CAPACITY` | Min Aurora ACUs     | `0.5`            | 0.5-16     | `1.0`      |
| `CDK_DATABASE_MAX_CAPACITY` | Max Aurora ACUs     | `1`              | 1-16       | `4.0`      |
| `CDK_DATABASE_READ_REPLICA` | Enable read replica | `false`          | true/false | `true`     |

**Read Replica Notes:**

- When `CDK_DATABASE_READ_REPLICA=true`: Creates a reader instance and stores hostname in Secrets Manager
- When `CDK_DATABASE_READ_REPLICA=false` (default): No reader instances created (cost optimization)
- The read replica hostname is passed to the application as `DB_HOST_READ_ONLY`
- Application creates a separate read-only TypeORM connection for read operations

**只读副本注意事项:**

- 当 `CDK_DATABASE_READ_REPLICA=true`: 创建阅读实例并且将主机名保存在密钥管理器中
- 当 `CDK_DATABASE_READ_REPLICA=false` (默认): 没有阅读实例被创建（成本优化）
- 只读副本主机名使用 `DB_HOST_READ_ONLY` 传递给应用程序
- 应用程序为了读取操作创建了一个分离的只读的TypeORM连接

#### Compute Variables 计算变量

| Variable                    | Purpose               | Default | Range     | Example |
| --------------------------- | --------------------- | ------- | --------- | ------- |
| `CDK_TASK_MEMORY_MB`        | Task memory (MB)      | `512`   | 512-30720 | `1024`  |
| `CDK_TASK_CPU_UNITS`        | Task CPU units        | `256`   | 256-4096  | `512`   |
| `CDK_SERVICE_DESIRED_COUNT` | Initial service count | `0`     | 0-100     | `2`     |
| `CDK_SERVICE_MIN_CAPACITY`  | Auto scaling minimum  | `0`     | 0-100     | `1`     |
| `CDK_SERVICE_MAX_CAPACITY`  | Auto scaling maximum  | `4`     | 1-100     | `10`    |

#### Scheduled Task Variables 计划任务变量

| Variable                         | Purpose                    | Default | Range     | Example       |
| -------------------------------- | -------------------------- | ------- | --------- | ------------- |
| `CDK_SCHEDULE_TASK_CLEANUP_CRON` | Cron expression (optional) | -       | -         | `"0 2 * * *"` |
| `CDK_SCHEDULER_TASK_MEMORY_MB`   | Scheduler memory (MB)      | `512`   | 512-30720 | `1024`        |
| `CDK_SCHEDULER_TASK_CPU_UNITS`   | Scheduler CPU units        | `256`   | 256-4096  | `512`         |

**Notes:**

- When `CDK_SCHEDULE_TASK_CLEANUP_CRON` is **not set**: No scheduled task resources are created
- When `CDK_SCHEDULE_TASK_CLEANUP_CRON` is **set**: Scheduled task service runs with desired count = 1
- The `hasScheduledTasks` derived property automatically controls resource creation
- Cron format: `"minute hour day month day-of-week"` (e.g., `"0 2 * * *"` = daily at 2 AM)

**注意事项:**

- 当 `CDK_SCHEDULE_TASK_CLEANUP_CRON` **没有被设置**: 没有计划任务被创建
- 当 `CDK_SCHEDULE_TASK_CLEANUP_CRON` **被设置**: 计划任务服务期望数为1
- 这个 `hasScheduledTasks` 派生属性自动控制资源创建
- Cron 格式: `"minute hour day month day-of-week"` (e.g., `"0 2 * * *"` = daily at 2 AM)

#### Tagging Variables 测试变量

| Variable        | Purpose             | Default            | Example            |
| --------------- | ------------------- | ------------------ | ------------------ |
| `CDK_TAG_APP`   | Application tag     | `${APP_NAME}`      | `nestjs-starter`   |
| `CDK_TAG_ENV`   | Environment tag     | `${ENVIRONMENT}`   | `production`       |
| `CDK_TAG_OU`    | Organizational unit | `engineering`      | `backend-team`     |
| `CDK_TAG_OWNER` | Resource owner      | `team@example.com` | `john@company.com` |

### Multi-Environment Strategy 多环境策略

Each environment uses:

- Separate AWS accounts or regions
- Environment-specific `.env` files
- Unique stack names: `${appName}-${environment}-${stackType}`
- Environment-specific resource sizing

每个环境使用:

- 分离式的AWS账户或者区域
- 环境专用的`.env`文件
- 独一无二的栈名: `${appName}-${environment}-${stackType}`
- 环境专有的资源尺寸调整

Example deployment commands:
部署命令示例:

```bash
# Development
CDK_ENVIRONMENT=dev npm run deploy

# Production
CDK_ENVIRONMENT=prd npm run deploy
```

## Security Model 安全模型

### Network Security

1. **VPC Isolation**: Application deployed in existing VPC with proper subnetting
2. **Security Groups**: Restrictive firewall rules between tiers
3. **Private Subnets**: Database and application in non-internet-routable subnets
4. **NAT Gateway**: Outbound internet access for updates and APIs

### 网络安全模型

1. **VPC 隔离**: 应用程序在合适的子网部署在现存的VPC上
2. **安全组**: 在两个层之前有限制性的防火墙规则
3. **私有子网**: 数据库和应用程序在“非互联网但可路由”中
4. **NAT（网络出口）网关**: 用于更新和API的访问出站互联网

### Application Security

1. **HTTPS Only**: SSL termination at load balancer with HTTP→HTTPS redirect
2. **Container Security**: Regular image scanning and minimal base images
3. **Secrets Management**: Database credentials in AWS Secrets Manager, JWT secrets in Systems Manager Parameter Store
4. **JWT Authentication**: JWT secret stored securely in `/nestjs-starter/jwt-secret` Parameter Store parameter
5. **IAM Roles**: Least privilege access for ECS tasks and Parameter Store access

### 应用程序安全

1. **仅仅支持HTTPS**: SSL终端在使用HTTP→HTTPS重定向下的负载魂哼
2. **容器安全**:常规的镜像扫描和最小化的基本镜像
3. **密钥管理**: 数据库证书在AWS密钥管理器中，JWT密钥在系统参数管理Store中
4. **JWT认证**: JWT密钥安全的保存在 `/nestjs-starter/jwt-secret` 参数Store中
5. **IAM 角色**: 最小权限连接ECS和参数Store访问

### Data Security

1. **Encryption at Rest**: Aurora Serverless v2 encryption enabled
2. **Encryption in Transit**: SSL connections to database
3. **Access Control**: Database security groups restrict access to application tier only
4. **Backup Encryption**: Automated backups encrypted

### 数据安全

1. **静态加密**: 开启Aurora Serverless v2 加密
2. **中转加密**: 使用SSL连接到数据库
3. **连接控制**: 数据库安全组仅仅重定向连接到应用程序层
4. **备份加密**: 自动化的备份加密

## Cost Optimization 成本优化

### Database Costs

- **Aurora Serverless v2**: Pay-per-use with scale-to-zero capability
- **Configurable Capacity**: Adjust `CDK_DATABASE_MIN_CAPACITY` and `CDK_DATABASE_MAX_CAPACITY` based on workload
- **Default Configuration**: 0.5-1 ACU for development (~$0.06-$0.12/hour when active)
- **Short Backup Retention**: 1 day (non-prod) / 7 days (production)
- **No Read Replicas**: Single writer instance for cost optimization

### 数据库成本

- **Aurora Serverless v2**: 按次付费、具备零规模功能
- **配置能力**: 根据工作量调整 `CDK_DATABASE_MIN_CAPACITY` and `CDK_DATABASE_MAX_CAPACITY`
- **默认配置**: 0.5-1 ACU for 开发 (~$0.06-$0.12/hour when active)
- **支持短备份**: 1 day (非生产模式) / 7 days (生产模式)
- **无读取副本**: 写入的单例以节约成本

### Compute Costs

- **Fargate Pricing**: Pay only for running containers
- **Configurable Resources**: Adjust `CDK_TASK_MEMORY_MB` and `CDK_TASK_CPU_UNITS` based on needs
- **Default Configuration**: 256 CPU / 512 MB memory for development workloads
- **Auto Scaling**: Configure `CDK_SERVICE_MIN_CAPACITY` and `CDK_SERVICE_MAX_CAPACITY` for optimal cost/performance
- **Desired Count**: Start with `CDK_SERVICE_DESIRED_COUNT=0` for development to minimize costs
- **Log Retention**: 1-week retention (non-prod) / 1-month retention (production)

### 计算成本

- **Fargate 计价**: 仅为了运行中的容器付费
- **配置资源**: 在需要的基础上按需配置 `CDK_TASK_MEMORY_MB` and `CDK_TASK_CPU_UNITS`
- **默认配置**: 256 CPU / 512 MB memory for 开发工作流
- **自动拓展**: 配置 `CDK_SERVICE_MIN_CAPACITY` and `CDK_SERVICE_MAX_CAPACITY` 优化成本和性能
- **期望实例数**: 使用 `CDK_SERVICE_DESIRED_COUNT=0`开启开发模式的最小成本
- **日志保留期限**: 1-week retention (非生产模式) / 1-month retention (生产模式)

### Scheduled Task Costs

- **Conditional Deployment**: Resources only created when `CDK_SCHEDULE_TASK_CLEANUP_CRON` is defined
- **No Load Balancer**: Eliminates ALB costs (~$16-22/month) for background tasks
- **Single Instance**: Runs exactly 1 Fargate task when enabled (configurable CPU/memory)
- **Default Configuration**: 256 CPU / 512 MB memory (same as main application)
- **Cost Control**:
  - **Development**: Leave `CDK_SCHEDULE_TASK_CLEANUP_CRON` unset to avoid costs
  - **Production**: Only enable when scheduled tasks are actually needed
- **Resource Sharing**: Uses same ECR images, VPC, and database as main application

### 计划任务成本

- **有条件的部署**: 只有当`CDK_SCHEDULE_TASK_CLEANUP_CRON` 被定义时，资源才会被创建
- **无负载均衡**: (~$16-22/month) 为后台任务消除ALB成本
- **单例模式**: 当可用时仅运行一个确切的实例(配置CPU/内存)
- **默认配置**: 256 CPU / 512 MB memory (同主程序)
- **成本控制**:
  - **开发**: 未设置 `CDK_SCHEDULE_TASK_CLEANUP_CRON` 以避免成本
  - **生产**: 只有明确需要的时候才开启计划任务
- **资源共享**: 与主程序使用相同的ECR镜像，VPC和数据库

### Network Costs

- **Existing Resources**: Leverages existing VPC and certificates
- **NAT Gateway**: Shared across subnets
- **CloudWatch**: Minimal monitoring configuration

### 网络成本

- **现有资源**: 利用现有的VPC和证书
- **NAT 网关**: 共享连接子网
- **云监控**: 最小化监控配置

### Cost Monitoring

Monitor costs using:

- AWS Cost Explorer
- CloudWatch billing metrics
- Resource tagging for cost allocation

### 成本监控

监控成本使用:

- AWS 成本浏览器
- CloudWatch 计费指标
- 用于成本分配的资源标签

## Monitoring and Observability 监控和可观察性

### Application Monitoring

1. **Health Checks**: ALB health checks on `/v1/health` endpoint (main application)
2. **Container Logs**: Centralized logging in CloudWatch for both main and scheduled task services
3. **Container Insights**: ECS cluster-level metrics for all services
4. **Scheduled Task Logs**: Separate log group (`/ecs/{appName}-scheduler-{environment}`) for background job output
5. **Custom Metrics**: Application-specific metrics via CloudWatch

### 应用程序监控

1. **健康检查**: 在这个接口 `/v1/health` 执行ALB健康检查 (主程序)
2. **容器日志**: 主程序和计划任务服务在CloudWatch集中收集日志
3. **容器洞察**: 所有服务的ECS集群级指标
4. **计划任务日志**: 为后台任务输出分离出日志组合(`/ecs/{appName}-scheduler-{environment}`)
5. **自定义指标**: 通过CloudWatch配置程序专用指标

### Infrastructure Monitoring

1. **CloudWatch Alarms**: CPU, memory, and connection metrics
2. **AWS X-Ray**: Distributed tracing (optional)
3. **VPC Flow Logs**: Network traffic analysis (optional)

### 基础设置监控

1. **CloudWatch 警告**: CPU、内存和连接指标
2. **AWS X光**: 分发跟踪 (可选的)
3. **VPC 流日志**: 网络连接分析 (可选的)

### Alerting Strategy

Set up alerts for:

- High CPU utilization (>80%) for both main and scheduled task services
- Database connection failures
- Application health check failures (main service)
- Scheduled task failures or unexpected exits
- High error rates in logs (both services)
- Scheduled task service not running when expected

### 报警策略

Set up alerts for:

- 主程序和计划任务高CPU利用率（超过80%）
- 数据库连接失败
- 应用程序健康检查失败（主程序）
- 计划任务失败或者意外退出
- 日志中的高错误率 (两种服务)
- 计划任务未按照预期执行

## Disaster Recovery 灾难恢复

### Backup Strategy

1. **Database Backups**:
   - Automated daily backups (7-day retention)
   - Point-in-time recovery available
   - Cross-region snapshots for production

2. **Application Images**:
   - ECR repository with image versioning
   - Multiple image tags for rollback capability

### 备份策略

1. **数据库备份**:
   - 自动化每天备份 (7-day retention)
   - 允许时间点恢复
   - 用于生产的跨区域快照

2. **应用程序镜像**:
   - ECR 仓库带有镜像版本
   - 为回滚能力配置镜像多标签

### Recovery Procedures

1. **Database Recovery**:

   ```bash
   # Restore from backup
   aws rds restore-db-cluster-to-point-in-time \
     --source-db-cluster-identifier original-cluster \
     --db-cluster-identifier restored-cluster \
     --restore-to-time 2025-01-01T00:00:00Z
   ```

2. **Application Rollback**:
   ```bash
   # Deploy previous image version
   aws ecs update-service \
     --cluster nestjs-starter-dev \
     --service nestjs-starter-dev \
     --task-definition nestjs-starter-dev:previous-revision
   ```

### 恢复程序

1. **数据库恢复**:

   ```bash
   # 从备份中Restore
   aws rds restore-db-cluster-to-point-in-time \
     --source-db-cluster-identifier original-cluster \
     --db-cluster-identifier restored-cluster \
     --restore-to-time 2025-01-01T00:00:00Z
   ```

2. **应用回滚**:
   ```bash
   # 部署前一个版本的镜像
   aws ecs update-service \
     --cluster nestjs-starter-dev \
     --service nestjs-starter-dev \
     --task-definition nestjs-starter-dev:previous-revision
   ```

## Troubleshooting 问题排查

### Common Issues

1. **Deployment Failures**:
   - Check CloudFormation events in AWS Console
   - Verify environment variables are correctly set
   - Ensure existing resources (VPC, certificates) are accessible

2. **Application Startup Issues**:
   - Check ECS service events
   - Review CloudWatch logs for error messages
   - Verify database connectivity and credentials

3. **Health Check Failures**:
   - Confirm `/v1/health` endpoint is responding
   - Check security group rules for ALB → ECS communication
   - Verify application is listening on correct port

4. **Scheduled Task Issues**:
   - Verify `CDK_SCHEDULE_TASK_CLEANUP_CRON` is set if tasks are expected
   - Check scheduled task service desired count (should be 1 when enabled, 0 when disabled)
   - Review scheduled task logs in separate log group: `/ecs/{appName}-scheduler-{environment}`
   - Ensure scheduled task service has database connectivity
   - Verify cron expression format is valid

### 常见问题

1. **部署失败**:
   - 在AWS控制台检查CloudFormation事件
   - 验证环境变量是否被设置正确
   - 确保现有资源是可以连接的（VPC、证书）

2. **应用程序启动问题**:
   - 检查ECS服务事件
   - 复审CloudWatch日志中的错误信息
   - 验证数据库可连接性和证书

3. **健康检查失败**:
   - 确认`/v1/health`接口有响应
   - 检查用于 ALB → ECS通信的安全组规则
   - 验证应用程序监听在正确的端口上

4. **计划任务问题**:
   - 如果有期望任务，验证 `CDK_SCHEDULE_TASK_CLEANUP_CRON` 被设置
   - 检查任务计划服务期望的镜像数 (should be 1 when enabled, 0 when disabled)
   - 复审分离的日志组中的计划任务日志: `/ecs/{appName}-scheduler-{environment}`
   - 确保计划任务服务有可用的数据库连接
   - 验证cron表达式是可用的

### Debugging Commands Debugging命令

```bash
# Check stack status 检查栈状态
aws cloudformation describe-stacks \
  --stack-name nestjs-starter-dev-compute

# View ECS service events 查看ECS服务事件
aws ecs describe-services \
  --cluster nestjs-starter-dev \
  --services nestjs-starter-dev

# Get recent application logs 获取最近的日志
aws logs filter-log-events \
  --log-group-name /ecs/nestjs-starter-dev \
  --start-time $(date -d '1 hour ago' +%s)000

# Get scheduled task logs 获取计划任务日志
aws logs filter-log-events \
  --log-group-name /ecs/nestjs-starter-scheduler-dev \
  --start-time $(date -d '1 hour ago' +%s)000

# Check scheduled task service status 检查任务计划状态
aws ecs describe-services \
  --cluster nestjs-starter-dev \
  --services nestjs-starter-scheduler-dev
```

## Best Practices 最佳实践

### Configuration Management

1. **Environment-Specific Values**: Use different `.env` files for each environment
2. **Resource Sizing**: Start small and scale up based on actual usage metrics
3. **Cost Monitoring**: Regularly review and adjust capacity settings based on usage
4. **Version Control**: Keep `.env.example` updated but never commit actual `.env` files
5. **Validation**: Test configuration changes in development before applying to production

### 配置管理

1. **环境专有的值**: 为每个环境使用不同的`.env`文件
2. **可变资源**: 从小处着手，根据实际指标扩大规模
3. **成本监控**: 常规复审，并且基于用量调整容量
4. **版本控制**: 保持 `.env.example` 更新 但永远不要commit .env文件
5. **验证**: 在部署在生产环境之前在开发环境中测试配置变更。

### Development Workflow

1. **Local Testing**: Test infrastructure changes in development environment first
2. **Progressive Deployment**: Deploy to dev → qa → production
3. **Infrastructure Validation**: Use `cdk diff` before deployments
4. **Resource Cleanup**: Regularly destroy development environments to save costs
5. **Scheduled Task Management**: Only enable scheduled tasks (`CDK_SCHEDULE_TASK_CLEANUP_CRON`) when actually needed to avoid unnecessary costs

### 开发工作流

1. **本地测试**: 首先在开发环境测试基础设施变更
2. **渐进式部署**: 从开发、测试、生产渐进式部署
3. **基础设施验证**: 在部署之前使用 `cdk diff`
4. **资源清理**: 定期销毁开发环境以节约成本
5. **计划任务管理**: 只有有确切的需求的时候才开启计划任务(`CDK_SCHEDULE_TASK_CLEANUP_CRON`)以节约成本

### Security Best Practices

1. **Credential Management**: Never store credentials in code or environment files
2. **Access Control**: Use IAM roles instead of access keys where possible
3. **Network Segmentation**: Maintain strict security group rules
4. **Regular Updates**: Keep CDK and AWS CLI updated

### 安全最佳实践

1. **证书管理**: 千万不要再代码或者环境文件中保存证书
2. **连接控制**: 在允许的情况下，使用IAM角色取代连接key
3. **网络分隔**: 维持严格的安全组规则
4. **常规更新**: 保持CDK和AWS CLI更新

### Operational Best Practices

1. **Monitoring**: Set up comprehensive monitoring before production deployment
2. **Documentation**: Keep infrastructure documentation updated
3. **Backup Testing**: Regularly test backup and recovery procedures
4. **Cost Optimization**: Review and optimize costs monthly

### 运营最佳实践

1. **监控**: 在生产部署之前启动全面的监控
2. **文档**: 保持基础设施文档更新
3. **备份测试**: 常规测试备份和恢复程序
4. **成本优化**: 每个月复审和优化成本

### Code Organization

1. **Stack Separation**: Maintain logical separation between network, database, ECR, compute, and scheduled tasks
2. **Configuration Management**: Use environment variables for all environment-specific values
3. **Version Control**: Tag infrastructure releases for rollback capability
4. **Code Reviews**: Review all infrastructure changes before deployment

### 代码组织

1. **栈分离**: 在网络、数据库、ECR、计算和计划任务之间保持逻辑上的分离。
2. **配置管理**: 为所有的特定环境使用专用的环境变量
3. **版本控制**: 为回滚能力提供基础设施发布标签
4. **代码复审**: 在部署之前复审全部的基础设施变更

---

This infrastructure provides a solid foundation for the NestJS Starter application with built-in scalability, security, and cost optimization. Regular review and updates ensure the infrastructure continues to meet application requirements as it evolves.

此基础设施给 NestJS Starter程序提供了坚定的基础，具备内建的可拓展性、安全性和成本优化的能力。定期复审和更新，确保基础设施能够继续满足程序发展过程中的需求。
