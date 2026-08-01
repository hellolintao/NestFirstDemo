# API Security Guide API 安全指南

This guide provides an overview of the API security approach used in the NestJS Starter application. It is intended for new engineers to understand how authentication and authorization are implemented, focusing on JWT (JSON Web Token) usage, the registration and sign-in flows, and the global JWT Auth Guard with public endpoint decorators.

本指南概述了在NestJS Starter程序中使用API安全方法。意图帮助新工程师理解身份验证和如何实现授权，重点关注于JWT使用，注册表和等级流，和在公共接口装饰器下的全局JWT授权守卫

---

## JWT Authentication Overview JWT认证概览

The application uses JWT for stateless authentication with a **global security-first approach**. By default, all API endpoints require authentication via a valid JWT token. JWTs are issued to users upon successful sign-in and must be included in the `Authorization` header for protected API requests. Endpoints that should be publicly accessible are explicitly marked with the `@Public()` decorator.

这个程序使用JWT用于无状态身份验证，并秉持“全局安全至上”的原则。默认情况下，所有的API接口必须经过一个JWT token认证。JWT在用户成功登陆后发放给用户，并且在进行受保护的API请求时，必须包含在`Authorization`中，公共接口中，应该明确的使用`@Public()`装饰器进行标记

### Why JWT? 为什么使用JSON WEB TOKEN

- **Stateless（无状态）:** No server-side session storage required. 无需服务器端的session存储
- **Scalable（可拓展性）:** Suitable for distributed systems and microservices. 适用于分布式系统和微服务
- **Secure（安全性）:** Payload is signed and can be verified. Payload是被签名的并且可以被验证

### Global Security-First Design 全局安全先行的设计

The application implements a "secure by default" approach where:
这个应用程序实现“默认安全”在以下方面

- JWT authentication is applied globally to all endpoints
- JWT认证应用于全局全部接口
- Endpoints must be explicitly marked as public using the `@Public()` decorator
- 接口必须明确的使用 `@Public()`装饰器进行标记
- This prevents accidentally exposing sensitive endpoints without authentication
- 这可以防止未经认证的意外暴露的敏感接口

---

## Authorization Header Format 认证头格式

Client applications must include the JWT in the `Authorization` header for all requests to protected endpoints. The expected format is:

客户端的请求头必须包含`Authorization`的JWT请求头来保护接口，预期的格式是：

```
Authorization: Bearer <jwt-token>
```

- **Bearer**: The keyword `Bearer` must precede the token, separated by a space.
- **承载者：** 这个字段 `Bearer`必须在token前面，使用space分割
- **<jwt-token>**: The actual JWT string returned by the sign-in endpoint.
- **<jwt-token>**：登陆接口返回实际的JWT字符串

Example request: 例如

```
GET /tasks HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If the header is missing or the format is incorrect, the server will reject the request with a 401 Unauthorized error.

如果请求头缺少或者格式错误，服务器将会阻止请求并且返回401未认证的错误。

---

## User Registration Flow 用户认证流

New users can create accounts using the registration endpoint:
新的用户可以使用注册接口创建账户：

1. **User submits registration data** to the `/auth/register` endpoint (username, email, password, etc.).
2. **Registration data is validated** using DTOs with class-validator decorators.
3. **User account is created** by the AuthService if validation passes.
4. **User entity is returned** in the response (sensitive fields like password are automatically excluded).
5. **User can then sign in** using their credentials to obtain a JWT token.

6. **用户提交注册数据** 给`/auth/register`接口（包括用户名、邮箱、密码等）
7. **注册数据是被验证的** 使用DTO和class-validator进行验证
8. **用户账户被创建** 如果验证通过则通过认证服务进行创建
9. **用户实体被返回** 在相应中被返回（诸如密码等敏感字段被自动化排除）
10. **用户可以登录** 使用他们获得到的JWT token被允许登录

### Registration Endpoint 注册接口

```
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Sign In Flow 登录工作流

1. **User submits credentials** to the `/auth/signin` endpoint (username and password).
2. **Credentials are validated** by the AuthService.
3. **JWT is generated** if credentials are valid. The token contains user identification and claims.
4. **JWT is returned** to the client in the response body.
5. **Client stores the JWT** (usually in local storage or memory) and includes it in the `Authorization: Bearer <token>` header for subsequent requests.

6. **用户提交证书**给接口`/auth/signin`（用户名和密码）
7. **证书被验证**通过认证服务
8. **JWT被创建** 如果证书合法，token中包含了用户身份信息和声明
9. **JWT被返回**给客户端，在相应体中
10. **客户端保存JWT**（通常保存在local storage或者内存中）并且包含在后续的请求头中`Authorization: Bearer <token>`

### Sign In Endpoint 登录接口

```
POST /auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securePassword123"
}
```

---

## Global JWT Auth Guard 全局JWT认证守卫

The application uses a **global JWT Auth Guard** that automatically protects all endpoints. This is configured in the `AuthModule` using NestJS's `APP_GUARD` provider:

本程序使用全局JWT认证守卫自动化保护全部接口。这需要在`AuthModule`模块中使用Nest的 `APP_GUARD`提供者中进行配置

```typescript
@Module({
  // ... other module configuration
  // APP_GUARD是一个特殊的令牌
  providers: [AuthService, JwtAuthGuard, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AuthModule {}
```

### How the Global Guard Works 如何使全局的守卫工作

1. **Every request** is intercepted by the `JwtAuthGuard`
2. **Public routes are checked first** - if a route or controller has the `@Public()` decorator, authentication is bypassed
3. **JWT validation occurs** for all non-public routes:
   - Extracts the JWT from the `Authorization: Bearer <token>` header
   - Validates the token signature and expiration
   - Adds the user payload to the request object for use in controllers
4. **Access is granted or denied** based on token validity

5. **每个请求**被`JwtAuthGuard`拦截
6. **公共路由优先检查** 如果路由或者控制器使用了 `@Public()` 装饰器，认证直接通过
7. **JWT认证发生** 针对于非公共路由

- 从`Authorization: Bearer <token>` 提取JWT
- 验证token签名和有效期
- 在请求对象中增加用户的payload，以便在控制器中使用

4. **连接被授权或者被拒绝**，基于token验证

## Public Endpoints with @Public() Decorator 被@Public()装饰的公共接口

Since authentication is applied globally, endpoints that should be publicly accessible must be explicitly marked with the `@Public()` decorator.

在认证被应用到全局之后，公共接口必须明确的使用 `@Public()` 装饰器进行标记

### Controller-Level Public Access 控制器级别的公共连接

Mark an entire controller as public:
标记一个控制器为公共的

```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Public() // 主要是这个装饰器
@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    // This endpoint is publicly accessible
    return { status: 'ok' };
  }
}
```

### Method-Level Public Access 函数级别的公共连接

Mark individual methods as public:
标记单独的函数作为公共的

```typescript
import { Controller, Post, Get } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public() // 标记这个函数
  @Post('signin')
  signIn() {
    // Public endpoint - no authentication required
  }

  @Public()
  @Post('register')
  register() {
    // Public endpoint - no authentication required
  }

  @Get('profile')
  getProfile() {
    // Protected endpoint - JWT required
  }
}
```

### Current Public Endpoints 当前的公共接口

The following endpoints are currently marked as public:
下属的接口是当前被标记为公共的

- `POST /auth/signin` - User authentication 用户授权
- `POST /auth/register` - User registration 用户注册
- `GET /v1/health` - Health check endpoint 健康检查接口

---

## Protected Endpoints and User Context 受保护的接口和用户上下文

All endpoints not marked with `@Public()` are automatically protected and require a valid JWT token. The guard extracts user information from the token and makes it available in the request object.

没有被 `@Public()`装饰的接口自动的被保护并且需要一个合法的JWT token。守卫从token中提取用户信息并且在请求对象中标记为合法的

### Accessing User Information in Controllers 在控制器中访问连接的用户信息

```typescript
import { Controller, Get, Request } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@Request() req: any) {
    // User information is available from the JWT payload
    // 如果存在用户信息，那么保存在这个字段里
    const user = req.user; // { sub: 'userId', username: 'johndoe' }
    return { message: `Hello ${user.username}` };
  }
}
```

The user object contains:
用户对象中包括

- `sub`: User ID (subject) 用户ID
- `username`: User's username 用户名

## Security Best Practices 、安全性的最佳实践

### Global Security Configuration 全局化的安全配置

- **Secure by default:** All endpoints require authentication unless explicitly marked public
- **Explicit public marking:** Use `@Public()` decorator only when necessary
- **Regular audit:** Review all `@Public()` decorators to ensure they should remain public

- **默认安全**，全部没有明确标记为公共的接口默认被保护
- **明确使用public标记的**，只有必要的时候才使用`@Public()`装饰器
- **常规审计**，复审全部 `@Public()`装饰器，来确保他们确实应该是公共的

### JWT Security JWT安全性

- **Use strong secrets:** Configure `JWT_SECRET` with a cryptographically secure random string
- **Set appropriate expiration:** Configure `JWT_EXPIRES_IN` (default: 1 hour) based on security requirements
- **Token storage:** Advise clients to store tokens securely (avoid localStorage for sensitive applications)

- **使用强密钥** 配置 `JWT_SECRET` 的时候应该使用加密安全的随机的字符串

### Input Validation 输入验证

- **Always validate input:** Use DTOs with class-validator decorators for all endpoints
- **Sanitize data:** Ensure user input is properly sanitized during registration and sign-in
- **Generic error messages:** Don't expose detailed error information that could aid attackers

- **永远验证输入** 给全部接口使用DTOs和class-validator装饰器
- **敏感数据** 确保在注册和登录过程中对用户输入数据脱敏（净化处理）

### Error Handling 错误捕获

- **Consistent responses:** Return generic 401 errors for authentication failures
- **No information leakage:** Avoid revealing whether a username exists during sign-in failures

- **一致的相应** 为未认证失败返回通用的401错误
- **无信息泄漏** 在登录失败时避免透露用户名是否存在
