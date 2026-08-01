# Docker Guide Docker指南

This guide provides comprehensive instructions for building, running, and managing Docker containers for the NestJS Starter application.

这个指南针对NestJs Starter应用程序的基础设施提供了全面的构建、运行、Docker容器管理。

## Table of Contents

- [Prerequisites 前置条件](#prerequisites)
- [Building the Docker Image 构建Dcoker容器](#building-the-docker-image)
- [Running the Container 在容器中运行](#running-the-container)
- [Environment Variables 环境变量](#environment-variables)
- [Container Management 容器管理](#container-management)
- [Cleanup 清理](#cleanup)
- [Development Workflow 部署工作流](#development-workflow)
- [Troubleshooting 故障排除](#troubleshooting)

## Prerequisites 签注条件

Before you begin, ensure you have Docker installed on your system:

在你开始之前，确保你的系统中已经安装了Docker

- **Docker Desktop** (recommended for Windows and macOS)
- **Docker Engine** (for Linux)

Verify your installation:

验证你的安装

```bash
docker --version
docker-compose --version
```

## Building the Docker Image 构建Docker镜像

The application uses a multi-stage Dockerfile for optimized production builds.

该程序使用多阶段Dockerfile来优化生产构建

### Basic Build 基本构建

Build the Docker image with a tag:

使用一个标签构建镜像

```bash
docker build -t nestjs-starter .
```

### Build with Custom Tag 使用自定义标签进行构建

```bash
docker build -t nestjs-starter:latest .
docker build -t nestjs-starter:v1.0.0 .
```

### Build with No Cache 无缓存构建

Force a fresh build without using cached layers:

在没有使用缓存的情况下强制全新构建

```bash
docker build --no-cache -t nestjs-starter .
```

### Build for Specific Platform 为特定的平台构建

Build for a specific platform (useful for cross-platform deployment):

为特定的平台构建（对跨平台部署很有用）

```bash
# For ARM64 (Apple Silicon, ARM servers)
docker build --platform linux/arm64 -t nestjs-starter:arm64 .

# For AMD64 (Intel/AMD x86_64)
docker build --platform linux/amd64 -t nestjs-starter:amd64 .
```

## Running the Container 在容器中运行（在本地的电脑上运行）

### Basic Run 基本运行

Start the container and map port 3000:

启动容器并且映射到3000端口

```bash
docker run -p 3000:3000 nestjs-starter
```

### Run in Detached Mode 在分离模式中运行

Run the container in the background:

在后台容器中运行

```bash
docker run -d -p 3000:3000 --name nestjs-app nestjs-starter
```

### Run with Custom Port Mapping 在自定义映射端口中运行

Map to a different host port:

映射到不同的端口

```bash
docker run -d -p 8080:3000 --name nestjs-app nestjs-starter
```

Access the application at `http://localhost:8080`

使用 `http://localhost:8080` 连接到应用程序

### Run with Restart Policy 使用重启策略运行

Automatically restart the container if it stops:

如果容器停止了那么自动重启

```bash
docker run -d -p 3000:3000 --name nestjs-app --restart unless-stopped nestjs-starter
```

## Environment Variables 环境变量

### Passing Environment Variables 传递环境变量

#### Single Environment Variable 单个环境变量

```bash
docker run -p 3000:3000 -e NODE_ENV=production nestjs-starter
```

#### Multiple Environment Variables 多环境变量

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  nestjs-starter
```

#### Using Environment File 使用环境文件

Create a `.env` file:

创建一个 `.env` 文件

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
LOG_LEVEL=info
```

Run with environment file:

使用环境文件运行

```bash
docker run -p 3000:3000 --env-file .env nestjs-starter
```

#### Environment Variables in Detached Mode 分离模式中的环境变量

```bash
docker run -d -p 3000:3000 \
  --name nestjs-app \
  --env-file .env \
  --restart unless-stopped \
  nestjs-starter
```

### Common Environment Variables 常见的环境变量

For a complete list of supported environment variables and their descriptions, see the [Configuration Guide](./configuration-guide.md).

查看[Configuration Guide](./configuration-guide.md) 以获得完整的环境变量支持列表

The following are commonly used environment variables when running the application in Docker:

当程序在Docker中运行的时候，下属是常见的环境变量

| Variable        | Description                                | Default      | Example                               |
| --------------- | ------------------------------------------ | ------------ | ------------------------------------- |
| `NODE_ENV`      | Node.js environment                        | `production` | `production`, `development`           |
| `APP_PORT`      | Application port (see Configuration Guide) | `3001`       | `3000`, `8080`                        |
| `LOGGING_LEVEL` | Logging level (see Configuration Guide)    | `debug`      | `debug`, `info`, `warn`, `error`      |
| `DATABASE_URL`  | Database connection string                 | -            | `postgresql://user:pass@host:5432/db` |

| 变量            | 描述                                   | 默认值       | 示例                                  |
| --------------- | -------------------------------------- | ------------ | ------------------------------------- |
| `NODE_ENV`      | Node环境变量                           | `production` | `production`, `development`           |
| `APP_PORT`      | 程序端口 (see Configuration Guide)     | `3001`       | `3000`, `8080`                        |
| `LOGGING_LEVEL` | 日志详细登记 (see Configuration Guide) | `debug`      | `debug`, `info`, `warn`, `error`      |
| `DATABASE_URL`  | 数据库连接字符串                       | -            | `postgresql://user:pass@host:5432/db` |

## Container Management 容器管理

### List Running Containers 正在运行的容器列表

```bash
docker ps
```

### List All Containers (including stopped) 列出包括停止状态的全部容器

```bash
docker ps -a
```

### View Container Logs 查看容器日志

```bash
# View logs 查看日志
docker logs nestjs-app

# Follow logs in real-time 实时追踪日志
docker logs -f nestjs-app

# View last 100 lines 查看最后的100行日志
docker logs --tail 100 nestjs-app
```

### Execute Commands in Running Container 在已运行容器中执行命令

```bash
# Open interactive shell 打开可交互shell
docker exec -it nestjs-app sh

# Run a single command 执行单命令
docker exec nestjs-app node --version
```

### Stop Container 停止容器

```bash
docker stop nestjs-app
```

### Start Stopped Container 启动容器

```bash
docker start nestjs-app
```

### Restart Container 重启容器

```bash
docker restart nestjs-app
```

### Remove Container 移除容器

```bash
# Stop and remove 停止并移除
docker stop nestjs-app
docker rm nestjs-app

# Force remove (stops and removes) 强制移除
docker rm -f nestjs-app
```

## Cleanup 清理

### Remove Unused Resources 移除未使用的资源

#### Remove Stopped Containers 移除已停止的容器

```bash
docker container prune
```

#### Remove Unused Images 移除未使用的镜像

```bash
docker image prune
```

#### Remove All Unused Resources 移除全部未使用资源

```bash
docker system prune
```

#### Remove Everything (including volumes) 移除全部东西

```bash
docker system prune -a --volumes
```

### Remove Specific Resources 移除特定的资源

#### Remove Specific Image 移除特定的镜像

```bash
docker rmi nestjs-starter
docker rmi nestjs-starter:v1.0.0
```

#### Remove Multiple Images 移除多个镜像

```bash
docker rmi $(docker images nestjs-starter -q)
```

## Development Workflow 部署工作流

### Development with Volume Mounting 在挂在卷的方式下部署

For development, you might want to mount your source code:

对于开发来说，你可能需要挂载你的资源代码

```bash
docker run -p 3000:3000 \
  -v $(pwd)/src:/usr/src/app/src \
  -e NODE_ENV=development \
  nestjs-starter
```

### Docker Compose for Development 对开发来说的Docker Compose

Create a `docker-compose.yml` file:

创建`docker-compose.yml`文件

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - ./src:/usr/src/app/src
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=nestjs_starter
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run with Docker Compose:

在 Docker Compose 下运行：

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Quick Development Commands 快速开发命令

```bash
# Build and run in one command 行内快速构建和运行
docker build -t nestjs-starter . && docker run -p 3000:3000 nestjs-starter

# Rebuild and restart 重建和重启
docker stop nestjs-app || true
docker rm nestjs-app || true
docker build -t nestjs-starter .
docker run -d -p 3000:3000 --name nestjs-app nestjs-starter
```

## Troubleshooting 故障排除

### Common Issues 常见问题

#### Port Already in Use 端口被占用

```bash
# Find process using port 3000 找到占用3000端口的进程
lsof -i :3000

# Kill process 杀死进程
kill -9 <PID>

# Or use different port 或者使用不同的端口
docker run -p 3001:3000 nestjs-starter
```

#### Container Exits Immediately 容器立即退出

Check logs for errors:

检查error的日志

```bash
docker logs nestjs-app
```

Run with interactive mode to debug:

在可交互模式中debug

```bash
docker run -it nestjs-starter sh
```

#### Image Build Fails 镜像构建失败

Build with verbose output:

在冗余输出下构建

```bash
docker build --progress=plain -t nestjs-starter .
```

#### Container Cannot Connect to External Services 容器不能连接到外部服务

Check network configuration:

检查网络配置

```bash
# Inspect container network 检查容器网络
docker inspect nestjs-app

# Use host network (Linux only) 使用主机网络
docker run --network host nestjs-starter
```

### Debugging Commands 调试命令行

```bash
# Inspect image 检查镜像
docker inspect nestjs-starter

# Check image history 检查镜像历史
docker history nestjs-starter

# Check container stats 检查容器统计
docker stats nestjs-app

# Export container filesystem 导出容器到文件系统
docker export nestjs-app > container.tar
```

### Health Checks 健康检查

Add health check to Dockerfile:

将健康检查添加到Dockerfile

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/v1/health || exit 1
```

Check health status:

检查健康状态

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Best Practices 最佳实践

1. **Use .dockerignore**: Keep build context small
2. **Multi-stage builds**: Separate build and runtime dependencies
3. **Non-root user**: Run containers with non-root user for security
4. **Environment variables**: Use for configuration, never hardcode secrets
5. **Health checks**: Implement health check endpoints
6. **Resource limits**: Set memory and CPU limits in production
7. **Logging**: Use structured logging and external log aggregation
8. **Security scanning**: Regularly scan images for vulnerabilities

9. **使用 .dockerignore**: 保持构建上下文小巧
10. **多阶段构建**: 分离构建时和运行环时依赖
11. **无根用户**: 为了安全在无根用户下运行容器
12. **环境变量**: 用于哦诶之，绝对不要对机密进行硬编码
13. **健康检查**: 设施健康检查接口
14. **资源限制**: 在生产环境中限制CPU和内存
15. **日志**: 使用结构化的日志记录和外部日志聚合
16. **安全扫描**: 日常扫描镜像漏洞

```bash
# Example with resource limits 资源限制示例
docker run -d -p 3000:3000 \
  --name nestjs-app \
  --memory="512m" \
  --cpus="1.0" \
  --restart unless-stopped \
  nestjs-starter
```

## Additional Resources 额外资源

- [Docker Official Documentation](https://docs.docker.com/)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Container Security Best Practices](https://docs.docker.com/engine/security/)
