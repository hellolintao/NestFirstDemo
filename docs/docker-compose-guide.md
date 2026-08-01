# Docker Compose Guide Dcoker Compose指南

## Purpose 目标

This project uses Docker Compose for local development. Docker Compose orchestrates the PostgreSQL database and pgAdmin services, making it easy to set up and manage your development environment without manual installation.

这个项目为本地开发使用Docker Compose，Docker Compose协调了PostgreSQL和pgAdmin服务，使其可以简单启动，在不用手动安装的情况下管理你的开发环境

## What Does This Compose Project Do? 这个Compose项目做什么？

- **PostgreSQL Database**: Runs a PostgreSQL container with default credentials for local development.
- **pgAdmin**: Runs pgAdmin, a web-based database management tool, allowing you to interact with your PostgreSQL database via a browser.
- **Networking**: Both services are connected to a custom Docker network for secure communication.
- **Persistent Storage**: Data is stored in Docker volumes to persist between container restarts.

- **PostgreSQL Database**: 为本地开发运行一个默认证书的PostgreSQL容器
- **pgAdmin**: 运行基于web的数据库管理工具pgAdmin，允许你通过浏览器与你的PostgreSQL数据库进行互动
- **Networking**:上述两个服务都连接到一个自定义的Docker网络，以确保安全通信
- **Persistent Storage**: 数据保存在Docker的卷中，以确保重启容器后保持不变

## How to Use 如何使用

### 1. Start the Docker Compose Project 启动 Docker Compose 项目

```bash
docker compose up -d
```

This command will start both the PostgreSQL and pgAdmin containers in detached mode.

此命令将在分离模式下启动PostgreSQL和pgAdmin容器

### 2. Stop the Docker Compose Project 停止 Docker Compose

```bash
docker compose down
```

This will stop and remove the containers, but your data will persist in the Docker volumes.

将会停止和移除容器，但是你的数据将在Docker卷中持续存在

### 3. Access pgAdmin 连接到pgAdmin

- Open your browser and go to: [http://localhost:8080](http://localhost:8080)
- Login with:
  - **Email**: `admin@admin.com`
  - **Password**: `admin`
- Add a new server in pgAdmin:
  - **Host**: `postgres`
  - **Port**: `5432`
  - **Username**: `nestuser`
  - **Password**: `nestpassword`

- 打开浏览器访问[http://localhost:8080](http://localhost:8080)
- 登录信息：
  - **Email**: `admin@admin.com`
  - **Password**: `admin`
- 在pgAdmin里面增加一个新服务
  - **Host**: `postgres`
  - **Port**: `5432`
  - **Username**: `nestuser`
  - **Password**: `nestpassword`

### 4. View Logs 查看日志

```bash
docker compose logs
```

### 5. Restart Services 重启服务

```bash
docker compose restart
```

## Environment Variables 环境变量

You can adjust database credentials and pgAdmin settings in the `docker-compose.yml` file as needed for your local setup.

如果你本地启动需要的话，你可以在`docker-compose.yml`文件中调整数据库证书和pgAdmin设置

## Troubleshooting 故障排除

- If you encounter issues, check container logs with `docker compose logs`.
- Ensure Docker is running and ports `5432` (Postgres) and `8080` (pgAdmin) are available.

- 如果你愈发哦问题，使用`docker compose logs` 检查容器日志
- 确保`5432` (Postgres) and `8080` (pgAdmin) 这两个端口号是可用的

---

For more details on Docker usage, see the main [Docker Guide](./docker-guide.md).
