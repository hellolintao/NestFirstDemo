# Application Configuration Guide 应用程序配置指南

This document explains how to configure the application. Proper configuration ensures the application runs as expected in different environments, for example development, quality, staging, or production.

此文档解释了如何配置应用程序。正确的配置确保应用程序运行在不同的环境中，例如开发、测试、预发布、生产环境

## Getting Started 启动

1. **Copy the Example Environment File:**
   - Duplicate `.env.example` as `.env` in the project root.
   - Adjust the values as needed for your local setup.

2. **Edit Environment Variables:**
   - Open `.env` and update variables to match your requirements.
   - The application loads these variables at startup.

3. **Run the Application:**
   - Use `npm run start` or your preferred command to launch the app.

4. **复制环境文件样本**
   - 在项目根目录重化工复制`.env.example` 为 `.env`
   - 调整你当前本地启动的值

5. **编辑环境变量值**
   - 打开 `.env`文件更新值以匹配你的需要
   - 应用程序将加载这些值作为启动

6. **运行应用程序**
   - 使用`npm run start`或者你更愿意使用的命令行工具启动app

## Environment Variables 环境变量

The following environment variables are available for configuration:
下面的环境变量的值时可用于配置的

| Name                       | Description                                                                                                                                                     | Default Value   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| APP_VERSION                | **Optional.** Application version string. Used for version health check. If not provided, falls back to version from package.json.                              | _Not set_       |
| APP_PORT                   | The port on which the application will run.                                                                                                                     | 3001            |
| LOGGING_LEVEL              | The logging level for the application. Allowed values: verbose, debug, log, warn, error, fatal                                                                  | log             |
| CORS_ALLOWED_ORIGIN        | CORS allowed origins. Use "\*" to allow all origins, or comma-separated list for specific origins (e.g., "https://app.com,http://localhost:3000")               | \*              |
| DB_HOST                    | PostgreSQL database host                                                                                                                                        | localhost       |
| DB_PORT                    | PostgreSQL database port                                                                                                                                        | 5432            |
| DB_USER                    | PostgreSQL database username                                                                                                                                    | nestuser        |
| DB_PASS                    | PostgreSQL database password                                                                                                                                    | nestpassword    |
| DB_DATABASE                | PostgreSQL database name                                                                                                                                        | nestdb          |
| DB_HOST_READ_ONLY          | **Optional.** PostgreSQL read replica host. If not provided, uses DB_HOST for read operations. Enables read-write splitting for database load balancing.        | _Not set_       |
| DB_SSL                     | Enable SSL for PostgreSQL connection. Allowed: true, false, "true", "false", 1, 0. Useful for cloud DBs or production.                                          | true            |
| DB_MIGRATIONS_RUN          | Automatically run migrations at startup.                                                                                                                        | true            |
| DB_LOGGING                 | Enable query logging for TypeORM. Allowed: true, false, "true", "false", 1, 0. Useful for debugging database queries in development.                            | false           |
| SCHEDULE_TASK_CLEANUP_CRON | **Optional.** Cron expression for scheduled task cleanup. Format: second minute hour day month weekday. If not provided, the cleanup job will not be scheduled. | _Not set_       |
| JWT_SECRET                 | Secret key used to sign JWT tokens for authentication. Store this value in a secure location.                                                                   | your-secret-key |
| JWT_EXPIRES_IN             | JWT token expiration time (e.g., "1h", "30m").                                                                                                                  | 1h              |

| Name                       | Description                                                                                                              | 默认值          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| APP_VERSION                | **可选的.** 应用程序可选的版本字符串，用于版本健康检查，如果没有提供，则退回到 package.json中的版本                      | _Not set_       |
| APP_PORT                   | 应用程序运行的端口号                                                                                                     | 3001            |
| LOGGING_LEVEL              | 应用程序的日志记录级别，允许的值包括verbose详细, debug调试, log日志, warn警告, error错误, fatal失败                      | log             |
| CORS_ALLOWED_ORIGIN        | CORS允许的来源，使用\*表示允许全部来源，或者使用逗号分隔符声明特定来源                                                   | \*              |
| DB_HOST                    | PostgreSQL 数据库主机                                                                                                    | localhost       |
| DB_PORT                    | PostgreSQL 数据库端口                                                                                                    | 5432            |
| DB_USER                    | PostgreSQL 数据库用户名                                                                                                  | nestuser        |
| DB_PASS                    | PostgreSQL 数据库密码                                                                                                    | nestpassword    |
| DB_DATABASE                | PostgreSQL 数据库名                                                                                                      | nestdb          |
| DB_HOST_READ_ONLY          | **O可选的.** PostgreSQL 只读副本主机，如果没有提供，则为读取操作使用DB_HOST。实现读写分离以实现负载均衡                  | _Not set_       |
| DB_SSL                     | 实现通过SSL连接PostgreSQL. 允许的值: true, false, "true", "false", 1, 0. 有助于生产模式或者数据云                        | true            |
| DB_MIGRATIONS_RUN          | 在启动时自动运行迁移                                                                                                     | true            |
| DB_LOGGING                 | 为 TypeORM 实现查询日志记录. Allowed: true, false, "true", "false", 1, 0.有助于在开发阶段调试数据库查询.                 | false           |
| SCHEDULE_TASK_CLEANUP_CRON | **可选的** 用户计划任务清理的Cron表达式. 格式: second minute hour day month weekday. 如果不提供，清理工作不会被列入计划. | _Not set_       |
| JWT_SECRET                 | 用户JWT token认证的密钥. 在一个安全的位置保存这个值.                                                                     | your-secret-key |
| JWT_EXPIRES_IN             | JWT token过期时间 (e.g., "1h", "30m").                                                                                   | 1h              |

## Environment Variable Precedence in NestJS Nest中环境变量的优先级

NestJS applications resolve environment variables using the following precedence order:
NestJs程序按照下面的优先级加载环境变量

1. **Process Environment (`process.env`)**: Values set in the running environment (e.g., via shell, Docker, CI/CD) override all others.
2. **`.env` File**: Variables defined in the `.env` file in the project root are loaded at startup if not already set in `process.env`.
3. **Default Values in Code**: If a variable is not set in either `process.env` or `.env`, the application may fall back to defaults defined in the code (e.g., in configuration service or module).

4. **进程的环境变量 (`process.env`)**，运行环境中设置的值将会覆盖全部其他的值，例如当前的shell、docker、CI/CD
5. **.env文件**，定义在项目根目录.env文件中的变量，将在启动阶段被加载，如果没有在进程环境变量中被设置的话
6. **代码中的默认值**，如果变量没有在`process.env` or `.env`被设置，应该程序也许会退回到代码中的默认设置（例如在配置服务或者模块中）

**Note:**
**注意**

- If a variable is set in multiple places, the value from `process.env` takes precedence.
- `.env.example` is only a template and is not loaded by the application.
- For production deployments, environment variables should be set securely at the infrastructure level.

- 如果一个变量在多处被设置，那么`process.env` 优先级最高
- `.env.example`仅仅是一个模板，不可以被应用程序加载
- 对于生产部署，环境变量应该在基础设置级别被安全的设置

For more details, see the [NestJS documentation on configuration](https://docs.nestjs.com/techniques/configuration).
对于更多细节，请看[NestJS documentation on configuration](https://docs.nestjs.com/techniques/configuration).

## Scheduled Task Configuration 任务计划配置

The application includes an optional scheduled task feature that can automatically clean up tasks from the database at regular intervals.
此应用包含了可选的任务计划功能，可以定期的自动执行清理任务

### Enabling Scheduled Task Cleanup 启动清理计划任务

To enable the scheduled task cleanup:
要启用计划任务的功能

1. Set the `SCHEDULE_TASK_CLEANUP_CRON` environment variable with a valid cron expression
2. Example: `SCHEDULE_TASK_CLEANUP_CRON=0 */5 * * * *` (runs every 5 minutes)

3. 在`SCHEDULE_TASK_CLEANUP_CRON`环境变量中使用有效的cron表达式进行设置
4. 例如`SCHEDULE_TASK_CLEANUP_CRON=0 */5 * * * *`每五分钟清理一次

### Disabling Scheduled Task Cleanup 禁用计划任务清理

To disable the scheduled task cleanup feature:
要禁用计划任务清理功能

- **Option 1**: Comment out the variable in your `.env` file:

  ```dotenv
  # SCHEDULE_TASK_CLEANUP_CRON=0 * * * * *
  ```

- **Option 2**: Remove the variable entirely from your `.env` file

- **Option 3**: Do not set the variable in your deployment environment

- **选项1** 在 `.env`文件中注释掉CRON代码
- **选项2** 在`.env` 文件中整个的移除变量
- **选项3** 不要再开发环境中设置变量

When the `SCHEDULE_TASK_CLEANUP_CRON` variable is not configured, the application will log an informational message and continue running without scheduling the cleanup job.
当 `SCHEDULE_TASK_CLEANUP_CRON`没有被配置，应用程序将会打印一个信息醒的消息，并且在没有清理计划任务下继续运行

### Cron Expression Format Cron 表达式格式

The cron expression follows the standard 6-field format:
Cron表达式采用下面的6字段格式

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └─── day of week (0-7, where 0 and 7 represent Sunday)
│ │ │ │ └───── month (1-12)
│ │ │ └─────── day of month (1-31)
│ │ └───────── hour (0-23)
│ └─────────── minute (0-59)
└───────────── second (0-59)
```

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └─── 星期几（0-7 0和7表示星期天）
│ │ │ │ └───── 月份 (1-12)
│ │ │ └─────── 日期 (1-31)
│ │ └───────── 小时 (0-23)
│ └─────────── 分钟 (0-59)
└───────────── 秒 (0-59)
```

Common examples:
常见的案例：

- `0 * * * * *` - Every minute
- `0 0 * * * *` - Every hour
- `0 0 0 * * *` - Every day at midnight
- `0 0 0 * * 0` - Every Sunday at midnight

- `0 * * * * *` - 每分钟
- `0 0 * * * *` - 每小时
- `0 0 0 * * *` - 每天凌晨
- `0 0 0 * * 0` - 每个周日的凌晨

## Example `.env` file `.env`文件示例

```dotenv
############################################################
# Example .env file for NestJS Starter
#
# Copy this file to `.env` and adjust values as needed.
############################################################

# Application Settings
APP_VERSION=0.1.0
APP_PORT=3001

# Logging Settings
LOGGING_LEVEL=log

# CORS Settings
# CORS_ALLOWED_ORIGIN: Allowed origins for Cross-Origin Resource Sharing
# Use "*" to allow all origins (development only)
# Use comma-separated list for specific origins: "https://app.com,http://localhost:3000"
CORS_ALLOWED_ORIGIN=*

# Database Settings
# PostgreSQL database connection configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=nestuser
DB_PASS=nestpassword
DB_DATABASE=nestdb
# Enable SSL for PostgreSQL connection (true/false/1/0)
DB_SSL=false
# DB_HOST_READ_ONLY: Optional read replica hostname for read-write splitting
# If not set, read operations use the primary database host (DB_HOST)
# DB_HOST_READ_ONLY=read-replica.localhost
# DB_MIGRATIONS_RUN: Automatically run migrations on startup (true/false) Default: true
DB_MIGRATIONS_RUN=true
# DB_LOGGING: Enable query logging for TypeORM (true/false) Default: false
DB_LOGGING=false

# Scheduled Task Settings
# Cron expression for task cleanup schedule (OPTIONAL)
# Format: second minute hour day month weekday
# To disable scheduled task cleanup, comment out or remove this variable
SCHEDULE_TASK_CLEANUP_CRON=0 * * * * *

# JWT Authentication Settings
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
```

## Tips for New Engineers 对新工程师的提示

- Always keep your `.env` file out of version control (it should be in `.gitignore`).
- Refer to `.env.example` for the latest list of supported variables.
- If you add new configuration options, update `.env.example` and this documentation.
- Never commit sensitive credentials to version control.
- For questions about configuration, ask your team or check the NestJS documentation.

- 永远保持你的`.env`脱离版本控制（在`.gitignore`文件中声明）
- 请参考`.env.example`文件以获取最新支持的变量列表
- 如果你增加了一个新的配置选项，请你更新`.env.example`和这个文档
- 不要将敏感的凭证提交到版本控制中
- 如果对配置存在问题，咨询你的小组或者检查NestJs文档
