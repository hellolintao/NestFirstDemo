# 用户模块指南

## dto

- create-user.dto.ts 创建用户的dto，规定了用户的基本信息结构

## 实体

- user.entity.ts 数据库实体

## 基本组件

- users.module.ts 只引用了数据库模块
- users.service.ts 用户服务，通过服务操作数据库，实现用户的增删改查
- users.controller.ts 只实现了/Users/profile 这个接口
