# 健康检查指南

## 基本组件

- health.module 模块，引入了专用于检查的TerminusModule模块
- indicators/version.health.ts 提供者，专用于检查版本，版本检查可以判断是否部署成功了
- health.controller 只提供了一个health接口，用于健康检查（提供了基本检查、版本检查、数据库检查）
