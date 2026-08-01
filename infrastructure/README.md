# NestJS Starter Infrastructure 基础设施

This directory contains the AWS CDK infrastructure code for the NestJS Starter application. The infrastructure is defined using TypeScript and AWS CDK v2, providing Infrastructure as Code (IaC) for deploying the application to AWS.

此目录下包含的是为 NestJS Starter项目提供的AWS CDK基础设施代码。基础设置使用TS和AWS CDK v2定义，提供了用于程序部署到SWA的基础设施即代码。

## Directory Structure 目录结构

```
infrastructure/
├── app.ts                      # CDK app entry point 程序入口
├── cdk.json                    # CDK configuration CDK配置
├── package.json                # NPM dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Example environment variables 环境变量示例
├── .env                        # Environment variables (create from .env.example) 环境变量
├── README.md                   # This file
└── stacks/                     # CDK stack definitions CDK栈定义
   ├── network.stack.ts         # Network infrastructure (VPC, Route 53, SSL) 网络栈
   ├── database.stack.ts        # Database infrastructure (Aurora Serverless v2) 数据库栈
   ├── compute.stack.ts         # Compute infrastructure (ECS, ALB) 计算栈
   ├── ecr.stack.ts             # ECR repository stack (container registry) ECR栈
   └── scheduled-task.stack.ts  # Scheduled task infrastructure (optional) 计划任务栈
```

## Architecture Overview 架构预览

The infrastructure is organized into five logical stacks:

此基础设置被组织进5个逻辑栈。

### 1. Network Stack (`network.stack.ts`)

- **VPC**: Uses an existing VPC specified by `CDK_VPC_ID`
- **Route 53**: Uses an existing hosted zone for DNS management
- **SSL Certificate**: Uses an existing ACM certificate for HTTPS
- **Domain**: Creates an alias record for the application

### 1. 网络栈 (`network.stack.ts`)

- **VPC**: 通过 `CDK_VPC_ID`使用现存指定的VPC
- **Route 53**:为DNS管理使用现存的主机空间
- **SSL Certificate**: 为HTTPS使用现存的ACM证书
- **Domain**: 为应用程序创建一个别名记录

### 2. Database Stack (`database.stack.ts`)

- **Aurora Serverless v2**: PostgreSQL database with cost optimization
- **Security**: Database security group with restricted access
- **Secrets**: Managed database credentials in AWS Secrets Manager
- **Networking**: Deployed in private subnets

### 2. 数据库栈(`database.stack.ts`)

- **Aurora Serverless v2**: 成本优化下的PostgreSQL
- **Security**: 严格连接下的数据库安全组
- **Secrets**: 在AWS密钥管理器下管理数据库证书
- **Networking**: 部署在私有子网中

### 3. ECR Stack (`ecr.stack.ts`) Amazon Elastic Container Service

- **ECR Repository**: Creates and manages an Amazon ECR repository for application container images
- **Image Scanning**: Enables image scan on push for vulnerability detection
- **Tag Mutability**: Allows mutable image tags
- **Removal Policy**: Retains repository in production, destroys in non-prod environments
- **Outputs**: Exports repository URI, name, and ARN for use in other stacks

### 3. ECR 栈 (`ecr.stack.ts`) Amazon Elastic Container Service

- **ECR 仓库**: 为程序容器镜像创建和管理亚马逊ECR仓库
- **Image Scanning**: 能够在推送时扫描镜像的漏洞
- **Tag Mutability**: 允许镜像多标签
- **Removal Policy**: 在生产模式保存仓库，非生产模式下销毁
- **Outputs**: 为其他栈道出仓库的URI、名称和ARN

### 4. Compute Stack (`compute.stack.ts`)

- **ECS Fargate**: Serverless container hosting
- **Application Load Balancer**: HTTP/HTTPS load balancing with health checks
- **Auto Scaling**: CPU-based scaling (1-4 instances, 50% CPU threshold)
- **Route 53**: DNS alias record pointing to the load balancer

### 4. 计算栈 (`compute.stack.ts`)

- **ECS Fargate**: Serverless 容器托管
- **Application Load Balancer**: HTTP/HTTPS 负载均衡与健康检查
- **Auto Scaling**: 基于CPU的拓展(1-4 instances, 50% CPU 阈值)
- **Route 53**: DNS别名记录指向负载均衡

### 5. Scheduled Task Stack (`scheduled-task.stack.ts`)

- **Conditional Deployment**: Only creates resources when `CDK_SCHEDULE_TASK_CLEANUP_CRON` is configured
- **ECS Fargate Service**: Dedicated service for running scheduled tasks (1 instance)
- **No Load Balancer**: Service doesn't receive HTTP requests, only runs scheduled processes
- **Automatic Restart**: ECS service ensures the instance restarts if it fails
- **Isolated Logging**: Separate CloudWatch log group for scheduled task logs
- **Database Access**: Same database credentials as the main application

### 5. 计划任务 (`scheduled-task.stack.ts`)

- **Conditional Deployment**: 只有配置 `CDK_SCHEDULE_TASK_CLEANUP_CRON`才会创建资源
- **ECS Fargate Service**: 运行计划任务的专用服务（1个实例）
- **No Load Balancer**: 服务不接受HTTP请求，只运行计划进程
- **Automatic Restart**: ECS服务确保在进程失败的时候重启
- **Isolated Logging**: 为计划任务日志分离出来单独的CloudWatch日志组
- **Database Access**: 与主程序采用相同的数据库证书

## Prerequisites 前置条件

Before deploying the infrastructure, ensure you have:

1. **AWS CLI** configured with appropriate credentials
2. **Node.js** (version specified in `.nvmrc` in the root directory)
3. **AWS CDK** installed globally (`npm install -g aws-cdk`)
4. **Environment variables** configured (see Configuration section)

在部署基础设置之前，确保你

1. **AWS CLI** 在合适的证书下配置
2. **Node.js** 在根目录 `.nvmrc` i下指定版本
3. **AWS CDK** 全局安装CDK(`npm install -g aws-cdk`)
4. **Environment variables** 配置环境变量 (see Configuration section)

## Configuration 配置

1. Copy the example environment file: 复制环境变量示例文件

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your specific values: 更新你指定的变量

   ```bash
   # Required variables
   CDK_ACCOUNT=123456789012          # Your AWS account ID 账户
   CDK_REGION=us-east-1              # AWS region 区域
   CDK_ENVIRONMENT=dev               # Environment (dev, qa, prd) 环境
   CDK_VPC_ID=vpc-xxxxxxxxxxxxxxxxx  # Existing VPC ID 现存的VPC ID
   CDK_HOSTED_ZONE_ID=Z1234567890ABC # Existing Route 53 hosted zone ID 现存的Route 53 hosted zone ID
   CDK_HOSTED_ZONE_NAME=example.com  # Hosted zone domain name 托管区域域名
   CDK_CERTIFICATE_ARN=arn:aws:acm:... # Existing SSL certificate ARN 现存的SSL证书
   CDK_DOMAIN_NAME=nestjs-starter-api # Subdomain for the application 应用程序的子域名

   # Optional: Scheduled Task Configuration 可选的计划任务配置
   CDK_SCHEDULE_TASK_CLEANUP_CRON=*/10 * * * * * # Cron expression for task cleanup Cron清理任务表达式
   ```

All environment variables are prefixed with `CDK_` and documented in `.env.example`.

全有的环境变量在`.env.example`中都是 `CDK_` 前缀

### Scheduled Task Configuration 计划任务配置

The scheduled task infrastructure is optional and controlled by the `CDK_SCHEDULE_TASK_CLEANUP_CRON` environment variable:

- **When configured**: Creates a dedicated ECS service that runs exactly 1 instance for scheduled tasks
- **When not configured**: Skips scheduled task stack creation entirely
- **Cron format**: Uses 6-field cron expressions (second minute hour day month weekday)
- **Examples**:
  - `*/10 * * * * *` - Every 10 seconds
  - `0 * * * * *` - Every minute
  - `0 0 * * * *` - Every hour
  - `0 0 0 * * *` - Every day at midnight

计划任务基础设施时可选的，并且通过`CDK_SCHEDULE_TASK_CLEANUP_CRON`环境变量进行配置

- **当配置后**: 创建一个专用的ECS服务，为计划任务运行一个实例
- **没有配置的时候**:完全跳过计划任务栈的创建
- **Cron 格式**: 使用6字段cron表达式 (second minute hour day month weekday)
- **Examples**:
  - `*/10 * * * * *` - Every 10 seconds
  - `0 * * * * *` - Every minute
  - `0 0 * * * *` - Every hour
  - `0 0 0 * * *` - Every day at midnight

The scheduled task service:

- Runs the same application image as the main service
- Has access to the same database
- Logs to a separate CloudWatch log group (`/ecs/app-scheduler-env`)
- Automatically restarts if the instance fails
- Does not receive HTTP traffic (no load balancer)

此计划任务服务:

- 与主服务运行同样的应用镜像
- 连接到相同的数据库
- 日志记录到一个CloudWatch单独的日志组中(`/ecs/app-scheduler-env`)
- 如果实例挂了自动重启
- 不接受HTTP请求（无负载均衡）

## Getting Started 快速启动

### 1. Install Dependencies 安装依赖

```bash
npm install
```

### 2. Build the Infrastructure Code 构建基础设施代码

```bash
npm run build
```

### 3. Bootstrap CDK (First Time Only) CDK引导程序（仅第一次）

```bash
npm run bootstrap
```

### 4. Synthesize CloudFormation Templates 合成CloudFormation模板

```bash
npm run synth
```

### 5. Deploy Infrastructure 部署基础设施

```bash
npm run deploy
```

### 6. Verify Deployment 验证部署

Check the AWS Console for created resources and test the application URL.

为创建资源检查AWS控制台，并且测试程序URL。

## Available Scripts 支持的脚本

| Script                    | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `npm run build`           | Compile TypeScript to JavaScript                   |
| `npm run watch`           | Watch for changes and auto-compile                 |
| `npm run test`            | Run Jest tests                                     |
| `npm run bootstrap`       | Bootstrap CDK in your AWS account/region           |
| `npm run synth`           | Synthesize CloudFormation templates                |
| `npm run deploy <stack>`  | Deploy a stack                                     |
| `npm run deploy:all`      | Deploy all stacks                                  |
| `npm run destroy <stack>` | Destroy a stack                                    |
| `npm run destroy:all`     | Destroy all stacks                                 |
| `npm run diff`            | Show differences between deployed and local stacks |

| Script                    | Description                        |
| ------------------------- | ---------------------------------- |
| `npm run build`           | 将TS编译成JS                       |
| `npm run watch`           | 监控变化并自动编译                 |
| `npm run test`            | 运行JEST测试                       |
| `npm run bootstrap`       | 在你的AWS账户/区域内引导CDK        |
| `npm run synth`           | 合成 CloudFormation 模板           |
| `npm run deploy <stack>`  | 部署一个栈                         |
| `npm run deploy:all`      | 部署全部栈                         |
| `npm run destroy <stack>` | 销毁一个栈                         |
| `npm run destroy:all`     | 销毁全部栈                         |
| `npm run diff`            | 展示本地栈和已经部署的栈之间的差异 |

## Stack Dependencies

The stacks have the following dependencies:

```
Network Stack
   ↓
Database Stack
   ↓
ECR Stack
   ↓
Compute Stack
   ↓
Scheduled Task Stack (optional)
```

- **Database Stack** depends on Network Stack (for VPC)
- **ECR Stack** is independent but typically referenced by Compute Stack for container images
- **Compute Stack** depends on Network Stack (for VPC, DNS), Database Stack (for database connection), and ECR Stack (for container image repository)
- **Scheduled Task Stack** depends on Compute Stack (for ECS cluster), Database Stack (for database connection), and ECR Stack (for container image repository)

## 栈依赖关系

栈有下面的依赖关系

```
网络 Stack
   ↓
数据库 Stack
   ↓
ECR Stack
   ↓
计算 Stack
   ↓
计划任务 Stack (optional)
```

- **数据库 Stack** 依赖于网络栈 (for VPC)
- **ECR Stack** 他是独立的，但是通常通过用于容器镜像的计算栈引用
- **计算 Stack** 依赖于网络栈(for VPC, DNS)、数据库栈(for database connection),和ECR栈depends on Network Stack(for container image repository)
- **计划任务 Stack** 依赖于计算 Stack (for ECS cluster), 数据库 Stack (for database connection), and ECR Stack (for container image repository)

## Cost Optimization Features 成本优化功能

The infrastructure is designed with cost optimization in mind:

牢记该基础设施的成本优化设计：

### Database

- Aurora Serverless v2 with minimal capacity (0.5-1 ACU)
- 7-day backup retention
- Minimal monitoring interval
- No read replicas initially

### 数据库

- 最小容量的(0.5-1 ACU)的Aurora Serverless v2
- 7-day备份保留
- Minimal monitoring interval 最小化的监控周期
- 无读取副本初始化

### Compute

- Fargate with minimal CPU/memory allocation (256 CPU, 512 MB)
- 1-week log retention
- Cost-optimized autoscaling (1-4 instances)

### 计算

- Fargate分配最小化的 CPU/memory (256 CPU, 512 MB)
- 1周的日志保留
- 成本控制下的自动拓展（1-4个实例）

### Scheduled Tasks

- Single instance only (no autoscaling)
- Same minimal resource allocation as main service
- Conditional deployment (only when needed)
- Separate log group with same retention policy

### 计划任务

- 单例模式（无自动拓展）
- 与主服务相同的最小化资源分配
- 条件部署（只在需要时）
- 使用相同的备份政策分隔日志组

### Networking

- Uses existing VPC and certificates (no additional charges)
- Minimal ALB configuration

### 网络

- 使用现有的VPC和证书（没有附加费用）
- 最小化的ALB配置

## Security Considerations

- Database deployed in private subnets
- Security groups restrict access between components
- Database credentials stored in AWS Secrets Manager
- HTTPS-only traffic with automatic HTTP → HTTPS redirection
- Container images scanned for vulnerabilities

## 安全注意事项

- 数据库部署在私网上
- 安全组在组件之间严格连接
- 数据库证书被保存在AWS密钥管理器中
- 在自动化 HTTP → HTTPS 重定向下仅仅使用HTTPS
- 容器镜像漏洞扫描

## Monitoring and Logging

- ECS container logs sent to CloudWatch
- Application Load Balancer access logs
- Container insights enabled on ECS cluster
- Health checks configured for application endpoint (`/v1/health`)

## 监控和日志

- ECS容器日志发送到CloudWatch
- 应用程序负载均衡连接日志
- ECS集群上启动了容器洞察
- 应用程序健康检查接口(`/v1/health`)

## Troubleshooting 问题排查

### Common Issues

1. **Missing Environment Variables**
   - Ensure all required variables in `.env.example` are set in `.env`
   - Check for typos in variable names

2. **VPC Not Found**
   - Verify `CDK_VPC_ID` exists in the specified region
   - Ensure AWS credentials have permission to access the VPC

3. **Hosted Zone Issues**
   - Confirm `CDK_HOSTED_ZONE_ID` and `CDK_HOSTED_ZONE_NAME` match
   - Verify hosted zone exists in your AWS account

4. **Certificate Problems**
   - Ensure `CDK_CERTIFICATE_ARN` is valid and in the correct region
   - Certificate must cover the domain specified in `CDK_DOMAIN_NAME`

5. **Scheduled Task Issues**
   - If scheduled tasks aren't running, check the cron expression format (6 fields)
   - Verify `CDK_SCHEDULE_TASK_CLEANUP_CRON` is set correctly
   - Check CloudWatch logs for the scheduled task service
   - Ensure the scheduled task service is running in ECS console

### 常见问题

1. **环境变量丢失**
   - 确保`.env.example`所有变量都被设置在了`.env`
   - 检查变量名是否拼写错误

2. **VPC未找到**
   - 验证`CDK_VPC_ID`在特定的区域上存在
   - 确保AWS证书有连接到VPC的权限

3. **主机区域问题**
   - 确认 `CDK_HOSTED_ZONE_ID` and `CDK_HOSTED_ZONE_NAME` 匹配
   - 验证主机空间在你的AWS账户上存在

4. **证书问题**
   - 确保`CDK_CERTIFICATE_ARN`是可用的并且在正确的区域
   - 证书必须覆盖在专用域名下`CDK_DOMAIN_NAME`

5. **计划任务问题**
   - 如果计划任务不运行，检查cron表达式 (6 fields)
   - 验证 `CDK_SCHEDULE_TASK_CLEANUP_CRON` 设置正确
   - 检查计划任务服务的 CloudWatch 日志
   - 确保计划任务服务在ECS控制台中运行

### Debugging Commands

```bash
# Check synthesized templates 检查合成模板
npm run synth

# Compare with deployed infrastructure 与已经部署的基础设施进行比对
npm run diff

# Validate environment variables 验证环境变量
node -e "require('dotenv').config(); console.log(process.env.CDK_VPC_ID)"
```

## Cleanup 清理

To destroy all infrastructure:

销毁全部基础设施

```bash
npm run destroy
```

**Warning**: This will permanently delete all resources created by the stacks. Ensure you have backups of any important data.

**警告**: 这将会永久的删除Stacks创建的全部资源。确保你对重要数据有备份。

## Support

For issues specific to this infrastructure:

1. Check the troubleshooting section above
2. Review AWS CloudFormation events in the AWS Console
3. Check CDK deployment logs
4. Refer to the Infrastructure Guide in `/docs` for more detailed information

如果关于基础设施有明确的问题：

1. 检查上述的问题排查章节
2. 在AWS控制台中复审AWSCloudFormation事件
3. 检查CDK部署日志
4. 参考基础设施指南 `/docs` 来获得更多细节信息
