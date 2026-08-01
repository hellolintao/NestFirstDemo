# 鉴权模块

- auth-user.decorator 自定义装饰器@AuthUser
- public.decorator 自定义装饰器@Public

- jwt-payload.dto jwt 荷载dto
- register.dto 注册信息dto
- sign-in.dto 登录dto
- sign-in-result.dto 登录结果dto

- jwt-auth.guard jwt鉴权守卫
- local-auth.guard 本地鉴权守卫

- jwt.strategy jwt策略
- local.strategy 本地策略

- auth.module 集成了一系列模块
- auth.service 鉴权服务，涉及到了用户注册、登录和验证
- auth.controller 授权控制器，提供了注册和登录接口
