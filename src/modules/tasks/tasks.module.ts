/**
 * 任务模块
 * Tasks Module
 *
 * 这个模块负责处理全部与任务有关的功能，保罗任务创建、管理和日程。
 * 它整合了为附加的必要数据的引用数据模块
 *
 * This module handles all task-related functionalities, including task creation,
 * management, and scheduling. It integrates with the Reference Data Module for
 * additional data requirements.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksSchedulerService } from './tasks-scheduler.service';
import { Task } from './entities/task.entity';
import { ReferenceDataModule } from '../reference-data/reference-data.module';

// 导入数据库模块、只读数据库模块、引用苏剧模块
// 两个具体的服务，任务服务和计划任务服务
@Module({
  imports: [TypeOrmModule.forFeature([Task]), TypeOrmModule.forFeature([Task], 'read-only'), ReferenceDataModule],
  controllers: [TasksController],
  providers: [TasksService, TasksSchedulerService],
})
export class TasksModule {}
