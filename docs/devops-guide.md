# DevOps Guide 开发运维指南

Welcome to the DevOps guide for the `nestjs-starter` project! This document is designed to help engineers understand the DevOps practices, tools, and workflows used in this repository.

欢迎来到 `nestjs-starter` 项目的开发运维指南！此文档被设计用于帮助工程师们理解版本库中的DevOps实践、工具、工作流

## Overview 概述

DevOps in this project focuses on automation, reliability, and maintainability. The main goals are to ensure code quality, automate testing, and streamline deployment processes.

DevOps在本项目中聚焦于自动化、可靠性和可维护性。主要的目标是确保代码质量，自动化测试，简化部署流程

## DevOps Tools Used DevOps工具的使用

### GitHub Actions

- **Purpose:** Automates CI/CD workflows, including running tests, building the project, and deploying code.
- **Location:** All workflow files are stored in the `.github/workflows/` directory (if present).
- **Common Workflows:**
  - **CI (Continuous Integration):** Runs tests and checks code quality on every push or pull request.
  - **CD (Continuous Deployment):** Deploys application to development environment with full infrastructure provisioning.
  - **Code Quality:** Performs automated code quality checks, formatting, security audits, and package analysis on a schedule, on push, or manually.

- **目标** 自动化的持续集成/持续部署的工作流，包括运行测试、项目构建和代码部署
- **位置** 所有的工作流文件全部保存在`.github/workflows/`目录下（如果存在）
- **通用工作流**
  - **CI（持续集成）** 在每次push和pull的请求中测试和检查代码质量
  - **CD（持续部署）** 将应用部署到开发环境，并配置完整的基础设置

## GitHub Actions Workflows

Currently, the project uses GitHub Actions for CI/CD. Below is a detailed description of the main workflow:
当前，这个项目使用GitHub Actions实现CI/CD。下面是主工作流的细节描述

### Code Quality Workflow (`code-quality.yml`) 代码质量工作流(`code-quality.yml`)

- **Purpose:** Automates code quality checks, formatting, testing, build validation, security audits, and package analysis.
- **Triggers:**
  - Scheduled: Daily at 2 AM UTC
  - Manual: Via GitHub Actions UI
  - On push to `main` branch or changes to relevant files
- **Main Steps:**
  1. Checkout repository (full history)
  2. Setup Node.js (from `.nvmrc`, with npm cache)
  3. Install dependencies (`npm ci`)
  4. Run ESLint and summarize results
  5. Check code formatting with Prettier
  6. Run tests with coverage and summarize results
  7. Build check
  8. Security audit (`npm audit`)
  9. Package analysis (`npm outdated`)
  10. Archive results as artifacts (retained for 7 days)
- **Importance:** Maintains code quality, security, and up-to-date dependencies. Summarizes results for easy review.

- **目标** 自动化的代码质量检查，格式化，测试，构建验证，安全审计和包分析
- **触发器**
  - 日程表：UTC实践每天2点
  - 手动：通过 GitHub Actions UI
  - 当Push到`main` 分支或者修改了相关文件时
- **主要步骤**
  1. 检出仓库（完整历史记录）
  2. 启动Node.js（在npm缓存下从`.nvmrc`启动）
  3. 安装依赖（`npm ci）
  4. 运行ESLint并且生成结果摘要
  5. 使用Prettier检查代码格式
  6. 运行带覆盖率的测试并且总结结果
  7. 构建检查（确保代码是可变异、可运行没有基础的错误的）
  8. 安全审查（`npm audit`）
  9. 包分析（`npm outdated`）
  10. 归档结果作为制品（保留7天）
- **重要** 维持代码质量、安全行和最新的依赖关系。摘要结果更方便复审

### Continuous Integration Workflow (`ci.yml`) 持续集成工作流

- **Purpose:** Validates every pull request to the `main` branch by building, linting, formatting, and testing the code.
- **Triggers:**
  - On pull requests targeting the `main` branch
  - Manual: Via GitHub Actions UI
- **Concurrency:**
  - Ensures only one workflow runs per branch/ref at a time; cancels in-progress runs for the same branch/ref.
- **Main Steps:**
  1. Checkout repository
  2. Setup Node.js (from `.nvmrc`, with npm cache)
  3. Install dependencies (`npm ci`)
  4. Lint code (`npm run lint`)
  5. Check code formatting (`npm run format:check`)
  6. Build application (`npm run build`)
  7. Run tests with coverage (`npm run test:coverage`)
  8. Install infrastructure dependencies (`npm ci` in `infrastructure/`)
  9. Build infrastructure TypeScript code (`npm run build` in `infrastructure/`)
  10. Create infrastructure `.env` file from GitHub variable (`CDK_ENV_DEV`)
  11. Configure AWS credentials for synth (OIDC, role assumption)
  12. Synthesize CDK stacks (`npm run synth` in `infrastructure/`)
- **Importance:** Ensures that all code merged into `main` passes linting, formatting, builds successfully, is covered by tests, and that the AWS CDK infrastructure code is valid and synthesizes successfully. This prevents broken or low-quality code and infrastructure from being merged and keeps the main branch stable.

- **目标** 通过构建、代码检查、格式检查和测试代码，对每个PR到main分支的代码
- **触发器**
  - 在PR的目标是main分支时
  - 手动：通过GitHub Actions UI
- **并发性**
  - 确保在一个时刻，每个分支/引用上只运行了一个工作流，取消正在进行的同一分支/引用的运行
- **主要步骤**
  1. 检出仓库
  2. 启动Node.js（在npm缓存下从`.nvmrc`启动）
  3. 安装依赖（`npm ci）
  4. 执行代码风格检查 (`npm run lint`)，这里是检查
  5. 进行格式化 (`npm run format:check`) 这里是会格式化代码，代码格式会被修改
  6. 构建应用 (`npm run build`)
  7. 运行带有覆盖率的测试 (`npm run test:coverage`)
  8. 安装基础设施依赖(`npm ci` in `infrastructure/`)
  9. 构建基础设置TypeScript代码(`npm run build` in `infrastructure/`)
  10. 从Github变量中创建基础设置 `.env` 文件 (`CDK_ENV_DEV`)
  11. 配置AWS证书用于合成（OIDC一种身份认证协议, role assumption一种获取临时权限的方式），为代码合成（synth）操作配置 AWS 凭证，该过程将通过 OIDC 协议进行身份验证，并采用角色扮演（role assumption）的方式来获取临时权限。这是一种现代、安全的 CI/CD（持续集成/持续部署）实践，确保自动化流程能够在没有硬编码密码的情况下，安全地获得执行部署任务所需的云服务权限。
  12. 合成CDK栈，CDK： AWS Cloud Development Kit
- **重要提示**，确保所有合并到main的代码通过了风格检查、格式化、成功构建、并且被测试覆盖，同时确保AWS CDK基础设置代码代码是有效的并且可以成功合成。者可以预防破坏性的或者低质量的代码和基础设置，从而保持住分支的稳定性

### Deploy to DEV Workflow (`deploy-dev.yml`) 部署到DEV（开发）的工作流

- **Purpose:** Automatically builds, tags with semver, pushes the Docker image to ECR, and deploys the application to the development environment on AWS, including infrastructure provisioning and container deployment.
- **Triggers:**
  - Manual: Via GitHub Actions UI with optional force bootstrap parameter
- **Prerequisites:**
  - GitHub Actions variables must be configured:
    - `AWS_ROLE_ARN_DEV` - AWS IAM Role ARN for development environment
    - `AWS_REGION` - AWS Region for deployment
    - `CDK_ENV_DEV` - Complete `.env` file content for CDK infrastructure
- **Main Steps:**
  1. **Application Build & Test:**
     - Checkout repository
     - Setup Node.js (from `.nvmrc`)
     - Install app dependencies
     - Build application
     - Run unit tests
  2. **Infrastructure Setup:**
     - Install infrastructure dependencies
     - Create infrastructure `.env` file from GitHub variables
     - Build infrastructure TypeScript code
     - Bootstrap CDK (smart check for existing bootstrap)
     - Synthesize CDK CloudFormation templates
  3. **Image Build & Push:**
     - Deploy ECR stack (container registry)
     - Generate semver tag from package.json version and build metadata
     - Build Docker image
     - Push image with both `latest` and semver tags (e.g., `0.1.0-build.123.abc1234`)
  4. **Deployment:**
     - Call reusable release workflow with generated semver tag
     - Deploy infrastructure and application
  5. **Cleanup:**
     - Remove sensitive files (`.env`, `cdk.out`)
- **Semver Tag Format:** `{package.json.version}-build.{run_number}.{short_sha}`
  - Example: `0.1.0-build.42.abc1234`
  - Note: Uses hyphen instead of plus sign to comply with ECR tag naming constraints
- **Security Features:**
  - Uses OIDC for AWS authentication (no long-lived credentials)
  - Automatic cleanup of sensitive files
  - Proper IAM role assumption with session naming
- **Timeout:** 30 minutes to prevent runaway deployments
- **Importance:** Enables rapid deployment of latest changes to development environment for testing and validation. Follows infrastructure-as-code principles with proper dependency management, security practices, and version tracking.

- **目标** 自动构建，语义化的标签（版本）、将Docker镜像推送到ECR（Amazon Elastic Container Registry，亚马逊弹性容器注册表），并且将程序部署在位于AWS上的开发环境，包括基础设施供应和容器部署
- **触发器**
  - 手动：在可选的启动参数下，使用GitHub Actions UI
- **先行条件**
  - GitHub Actions变量必须配置
  - `AWS_ROLE_ARN_DEV` - Amazon Web Services（亚马逊云服务平台） Identity and Access Management（身份与访问管理服务） Amazon Resource Name（亚马逊资源名称） 用于开发环境的AWS IAM角色的ARN
  - `AWS_REGION` - AWS 开发区域
  - `CDK_ENV_DEV` - 完善 `.env` 文件中的CDK（AWS Cloud Development Kit）基础设施内容
- **主要步骤**
  1. **应用程序构建和测试**
  - 检出仓库
  - 启动Node(from `.nvmrc`)
  - 安装依赖
  - 构建应用
  - 运行单元测试
  2. **基础设施起步**
  - 安装基础设施依赖
  - 从Github变量中创建基础设施的`.env`文件
  - 构建基础设施TS代码
  - 启动CDK（现有启动程序的智能检查）
  - 合成CDK CloudFormation模板
  3. **镜像构建和推送**
  - 部署ECR栈（注册容器）
  - 从 package.json 中创建语义化标签并且构建元数据
  - 构建docker镜像
  - 将镜像打上latest和语义化标签，并且推送
  4. **部署**
  - 使用生成的semver tag调用可重复使用的发布工作流
  - 部署基础设施和应用程序
  4. **清理**
  - 移除掉敏感文件(`.env`, `cdk.out`)
- **语义化标签格式** `{package.json.version}-build.{run_number}.{short_sha}`
  - 例如 `0.1.0-build.42.abc1234` 表示包版本0.1.0 build.42构建第42次.短sha
  - 注意：使用连字符取代加号，以遵循ECR标签命名约束
- **安全特性**
  - 为AWS认证使用OIDC（OIDC一种身份认证协议, role assumption一种获取临时权限的方式）
  - 自动清理敏感文件
  - 通过会话命名实现正确的IAM（Identity and Access Management）角色假设
- **超时** 30分钟内防止部署失控
- **Importance** 确保最新的变更可以快速的部署到开发环境以用来测试和验证。遵循基础设施作为代码的原则，试试适当的依赖管理、安全实践和版本跟踪

### Release (Reusable) Workflow (`release-reusable.yml`) （可重复利用的）发布工作流

- **Purpose:** Reusable workflow for deploying a specific image version to any environment. Centralizes deployment logic.
- **Triggers:**
  - Called by other workflows (deploy-dev, release-manual)
- **Inputs:**
  - `image_tag` - Container image tag to deploy (e.g., `0.1.0-build.123.abc1234`, `latest`)
  - `environment` - Target environment (dev, qa, prd)
  - `aws_region` - AWS region for deployment
  - `aws_role_arn` - AWS IAM role ARN for the environment
  - `cdk_env_content` - CDK environment configuration
- **Main Steps:**
  1. Checkout repository
  2. Setup Node.js
  3. Configure AWS credentials
  4. Install and build infrastructure
  5. Synthesize CDK stacks
  6. Deploy infrastructure stacks (Network, Database, Compute, Scheduled Task)
     - Passes `appVersion` context to CDK for APP_VERSION environment variable
  7. Update ECS services to deploy specified image version
  8. Cleanup sensitive files
- **Importance:** Provides consistent deployment process across all environments. Ensures proper version tracking through APP_VERSION environment variable.

- **目标** 为部署一个具体版本的镜像到任何一个环境创建一个可重复利用的工作流。集中部署逻辑。
- **触发条件**
  - 通过其他工作流被调用（deploy-dev, release-manual）
- **输入**
  - `image_tag` - 要部署的容器标签 (e.g., `0.1.0-build.123.abc1234`, `latest`)
  - `environment` - 目标环境 (dev, qa, prd)
  - `aws_region` - AWS 部署区域
  - `aws_role_arn` - AWS IAM role ARN for the environment 目标环境的aws_role_arn
  - `cdk_env_content` - CDK 环境配置
- **主要步骤**
  1. 检出仓库
  2. 启动Node
  3. 配置AWS证书
  4. 安装和构建基础设置
  5. 合成CDK栈
  6. 部署基础设施栈（网络、数据库、计算机、计划任务）
  - 将 `appVersion` 上下文传递给CDK，以作为APP_VERSION环境变量
  7. 更新ECS服务来部署专门的镜像
  8. 清理敏感文件
- **重要** 为所有环境提供一致的部署流程。确保可以通过APP_VERSION环境变量可以正确的追踪版本

### Release (Manual) Workflow (`release-manual.yml`) 手动发布工作流

- **Purpose:** Allows manual deployment of any tagged image to any environment via GitHub Actions UI.
- **Triggers:**
  - Manual: Via GitHub Actions UI (workflow_dispatch)
- **Inputs:**
  - `image_tag` - Container image tag to deploy (e.g., `0.1.0-build.123.abc1234`, `latest`)
  - `environment` - Target environment (dev, qa, prd) - dropdown selection
- **Main Steps:**
  - Configures AWS credentials based on selected environment
  - Calls reusable release workflow with specified parameters
- **Use Cases:**
  - Deploy a specific version to QA or production
  - Rollback to a previous version
  - Deploy a tested build from dev to other environments
- **Importance:** Enables controlled deployments and rollbacks without rebuilding. Supports progressive deployment strategy.

- **目标** 允许将被tag过的任何镜像通过GitHub Actions UI手动部署到任何环境
- **触发条件**
  - 手动的：通过GitHub Actions UI (workflow_dispatch)
- **输入**
  - `image_tag` - 将要部署的容器标签 (e.g., `0.1.0-build.123.abc1234`, `latest`)
  - `environment` - 目标环境 (dev, qa, prd) - dropdown selection
- **主要流程**
  - 基于所选的环境哦诶之AWS证书
  - 使用特定的参数调用可反复利用的发布流程
- **用例**
  - 部署特定的版本到QA上或者生产环境上
  - 会滚到上一个版本
  - 为开发环境部署一个测试构建或者其他环境
- **重要性** 在没有重建的情况下，部署和回滚是可控的。支持渐进式部署策略

### Tag ECR Image Workflow (`tag-image.yml`) ECR（亚马逊弹性容器）标记工作流

- **Purpose:** Manually apply additional tags to existing ECR images without rebuilding.
- **Triggers:**
  - Manual: Via GitHub Actions UI (workflow_dispatch)
- **Inputs:**
  - `current_tag` - Existing image tag (e.g., `0.1.0-build.123.abc1234`)
  - `new_tag` - New tag to apply (e.g., `0.1.0`, `v0.1.0`, `stable`)
  - `environment` - Environment (determines AWS account)
- **Main Steps:**
  1. Configure AWS credentials for selected environment
  2. Get image manifest for current tag
  3. Apply new tag to the same image
  4. Verify new tag was created successfully
- **Use Cases:**
  - Tag a semver build as a release version (e.g., `0.1.0-build.42.abc1234` → `0.1.0`)
  - Mark an image as stable or approved (e.g., `0.1.0-build.42.abc1234` → `stable`)
  - Create semantic version tags for release tracking
- **Importance:** Enables flexible version management and release processes without rebuilding images.

- **目标** 在不用重建的情况下，手动的将额外的标签应用到当前存在的ECR镜像上
- **触发器**
  - 手动的：通过 GitHub Actions UI（工作流分发workflow_dispatch）
- **主要步骤**
  - `current_tag` - 当前的镜像标签 (e.g., `0.1.0-build.123.abc1234`)
  - `new_tag` - 新标签 (e.g., `0.1.0`, `v0.1.0`, `stable`)
  - `environment` - 环境 (determines AWS account)
- **用例**
  1. 创建语义化build标签作为发布版本(e.g., `0.1.0-build.42.abc1234` → `0.1.0`)
  2. 标记一个镜像为稳定的stable或者已批准approved(e.g., `0.1.0-build.42.abc1234` → `stable`)
  3. 为了发布追踪，创建语义化版本标签
- **重要性** 确保弹性的版本管理，并且发布过程可以在不用重建镜像

### Teardown Infrastructure Workflow (`teardown-manual.yml`) 基础设施拆除工作流

- **Purpose:** Manually destroy all AWS CDK infrastructure for a specific environment.
- **Triggers:**
  - Manual: Via GitHub Actions UI (workflow_dispatch)
- **Inputs:**
  - `environment` - Target environment to teardown (dev, qa, prd) - dropdown selection
- **Prerequisites:**
  - GitHub Actions variables must be configured:
    - `AWS_ROLE_ARN_DEV`, `AWS_ROLE_ARN_QA`, `AWS_ROLE_ARN_PRD` - AWS IAM Role ARNs for each environment
    - `AWS_REGION` - AWS Region for deployment
    - `CDK_ENV_DEV`, `CDK_ENV_QA`, `CDK_ENV_PRD` - Complete `.env` file content for CDK infrastructure
- **Main Steps:**
  1. Checkout repository
  2. Setup Node.js (from `.nvmrc`)
  3. Configure AWS credentials for selected environment
  4. Install infrastructure dependencies
  5. Create infrastructure `.env` file from GitHub variables
  6. Synthesize CDK stacks
  7. Destroy all CDK stacks with force flag
- **Security Features:**
  - Uses OIDC for AWS authentication (no long-lived credentials)
  - Proper IAM role assumption with session naming
  - Concurrency control prevents simultaneous teardowns of the same environment
- **Timeout:** 45 minutes to allow for complete stack deletion
- **Use Cases:**
  - Clean up temporary or test environments
  - Remove infrastructure to reduce costs
  - Reset environment to baseline state
- **Importance:** Provides safe and controlled way to remove all infrastructure resources. Essential for cost management and environment lifecycle management.
- **⚠️ Warning:** This action is destructive and will delete all infrastructure resources including databases, networking, and compute resources. Use with caution, especially in production environments.

- **目标** 手动的为特定的环境销毁全部的AWS CDK基础设施
- **触发条件**
  - 手动的： GitHub Actions UI (workflow_dispatch)
- **输入**
  - `environment` - 拆除的目标环境 (dev, qa, prd) - dropdown selection
- **前置条件**
  - 必须设置Github Actions 变量
    - `AWS_ROLE_ARN_DEV`, `AWS_ROLE_ARN_QA`, `AWS_ROLE_ARN_PRD` - 每个环境的AWS IAM Role ARNs
    - `AWS_REGION` - AWS 部署区域
    - `CDK_ENV_DEV`, `CDK_ENV_QA`, `CDK_ENV_PRD` - 为CDK基础设施完善 `.env` 文件
- **主要步骤**
  1. 检出仓库
  2. 启动Node
  3. 为选择的环境配置AWS证书
  4. 安装基础设施依赖
  5. 从GitHub variables中穿件基础设施 `.env` 文件
  6. 合成CDK栈
  7. 使用强制flag销毁全部CDK栈
- **安全特性**
  - 为AWS认证使用OIDC（无长久有效的证书）
  - 在命名回话下使用正确的IAM假定角色
  - 并发控制可以阻止同一环境被同时销毁
- **超时** 45分钟以完成堆栈删除
- **用例**
  - 清理临时或者测试环境
  - 移除基础设施以减少成本
  - 充值环境基本状态
- **重要** 提供安全并且可控的方式来移除全部的基础设施资源。者对成本管理和环境生命周期管理是必要的。
- **警告** 这是一个具备破坏性的动作，将会删除包括数据库，网络，计算资源的全部基础设施资源。小心使用，尤其是在生产环境下！

---

## Additional Resources 附加资源

- [NestJS Documentation](https://docs.nestjs.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [ESLint Documentation](https://eslint.org/)

---

If you have questions or need help, reach out to your team or check the documentation above.
