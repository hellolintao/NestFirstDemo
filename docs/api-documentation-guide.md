# API Documentation Guide API文档指南

This guide explains how API documentation is generated and accessed in this NestJS project using Swagger and OpenAPI standards.

这个指南解释了在NestJs项目中如何使用Swagger和OpenAPI标准生成和访问API文档

---

## Overview 概览

NestJS integrates Swagger to automatically generate interactive API documentation and OpenAPI specifications. This is achieved using decorators provided by the `@nestjs/swagger` package, which annotate controllers, DTOs, and models to describe endpoints, request/response schemas, and other metadata.

NestJS整合了Swagger用来自动化生成可交互的API文档和OpenAPI规格。这里的实现使用了`@nestjs/swagger`提供的装饰器，这些装饰器可以注释控制器，DTO和模型，用来描述端点、请求/相应模式和其他元数据

---

## How Documentation Is Generated 文档是如何创建的

1. **Install Swagger Module 安装Swagger模块**
   - The project uses `@nestjs/swagger` to generate documentation. 这个项目使用`@nestjs/swagger`来创建文档
   - Decorators like `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and others are used in controllers and DTOs. 像`@ApiTags`, `@ApiOperation`, `@ApiResponse`这样的装饰器，用于控制器和DTO中

2. **Decorators 装饰器**
   - `@ApiTags('tag')`: Groups endpoints under a tag in the UI. 将接口在UI中分组到这个tag下
   - `@ApiOperation({ summary: '...' })`: Describes the endpoint's purpose. 描述这个接口的目的
   - `@ApiResponse({ status: 200, description: '...' })`: Documents possible responses. 可能的相应
   - DTOs and entities are annotated for schema generation. DTO和实体被注释用于模式生成

3. **Setup in Main Application 在主程序中起步**
   - Swagger is typically set up in `main.ts` using `SwaggerModule` Swagger典型的是在`main.ts`中使用`SwaggerModule`启动:
     ```ts
     import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 引入必要的包
     // ...existing code...
     const config = new DocumentBuilder() // 创建新实例
       .setTitle('API Documentation') // 设置标题
       .setDescription('NestJS Starter API') // 设置描述
       .setVersion('1.0') // 设置版本
       .build(); // 构建
     const document = SwaggerModule.createDocument(app, config); // 创建，绑定程序和配置
     SwaggerModule.setup('api/docs', app, document); // 启动文档
     // ...existing code...
     ```

---

## Accessing the Documentation 在文档中访问

### 1. Swagger UI

- **URL:** `/apidoc`
- **Description:** Interactive web interface to explore and test API endpoints.
- **How to use:** Open a browser and navigate to `http://localhost:<port>/apidoc` after starting the server. 打开浏览器这个URL就可以访问文档了

### 2. OpenAPI Specification (JSON) OpenAPI JSON规范

- **URL:** `/apidoc-json`
- **Description:** Raw OpenAPI spec in JSON format for use with tools or automation.
- **How to use:** Fetch `http://localhost:<port>/apidoc-json`.

### 3. OpenAPI Specification (YAML) OpenAPI YAML规范

- **URL:** `/apidoc-yaml`
- **Description:** Raw OpenAPI spec in YAML format (if enabled).
- **How to use:** Fetch `http://localhost:<port>/apidoc-yaml`.

---

## Customization 定制化

- You can customize the documentation by editing the `DocumentBuilder` options in `main.ts`. 在`main.ts`的`DocumentBuilder`编辑自定义内容
- Add or modify decorators in controllers and DTOs to improve the generated docs. 在控制器和DTO中增加或者编辑装饰器来改善文档生成

---

## Best Practices 最佳实践

- Always annotate new endpoints and DTOs with appropriate Swagger decorators. 永远使用合适的Swagger装饰器来注释新接口和DTO
- Keep documentation up to date with API changes. 保持文档和API同步更新
- Use tags to organize endpoints logically. 使用标签有逻辑的组织接口

---

## References 参考文档

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
