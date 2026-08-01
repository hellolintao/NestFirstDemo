# 项目总结

> note _使用自己的语言解释项目_

## 目录结构

- docs 文档
  - api-documentation-guide 文档指南，使用swagger生成文档
  - api-security-guide 安全指南，包括JWT和安全原则
  - configuration-guide 配置指南，包括常规配置、计划任务配置、Cron表达式
  - devops-guide 运维指南，这篇文档很长，主要包含代码质量、CI、部署到DEV、发布、手动发布、ECR、拆除等工作流
  - docker-compose-guide docker compose指南
  - docker-guide docker指南，包括构建、运行、管理、清理等
  - infrastructure-guide 基础设施指南，该文档主要是提供了针对AWS的指南，对于其他云平台具备一些参考性

- infrastructure 基础设施 围绕着这五个栈展开
  - network.stack.ts
  - database.stack.ts
  - compute.stack.ts
  - ecr.stack.ts
  - scheduled-task.stack.ts

- src 主要资源
  - main.ts 程序入口
  - app.module 主模块
  - common 通用
    - type/paginated.type 分页的类型定义
  - config 配置
    - configuration 定义配置的规则
    - typeorm.config 配置数据库
  - migrations 迁移和反迁移
    - 1757616723274-CreateTaskTable
    - 1757616900000-CreateUserTable
    - 1760869368144-CreateTaskPriorityTable
    - 1760869380977-SeedTaskPriorityData
    - 1760869400000-AddUserIdToTask
    - 1761994740000-AddTaskPriorityCodeToTask
  - module 模块
    - users
      - dto/create-user.dto
      - entities/user.entity
      - users.module
      - users.service
      - users.controller
    - health
      - indicators/version.health 版本健康检查服务
      - health.module
      - health.controller
    - core
      - core.module
      - typeorm-logger.service 日志服务
    - reference-data
      - dto/get-task-priority-params.dto
      - entities/task-priority.entity
      - reference-data.module
      - task-priority.service
      - reference-data.controller
    - task
      - dto
        - create-task.dto
        - get-task-params.dto
        - get-tasks-query.dto
        - update-task.dto
      - entities/task.entity
      - tasks.module
      - tasks.service
      - tasks-scheduler.service
      - tasks.controller
    - auth
      - decorators 自定义装饰器
        - auth-user.decorator
        - public.decorator
      - dto
        - jwt-payload.dto
        - register.dto
        - sign-in-result.dto
        - sign-in.dto
      - guards
        - jwt-auth.guard
        - local-auth.guard
      - strategies
        - jwt.strategy
        - local.strategy
      - auth.module
      - auth.service
      - auth.controller

1
