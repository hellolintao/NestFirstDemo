import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { TasksService } from './tasks.service';

/**
 * 计划任务服务
 * TasksSchedulerService
 *
 * 这个服务提供了可选的，函数式的使用cron进行计划任务清理。
 * 它有条件地，在配置的基础上注册一个cron job，在特定的周期自动化的从数据库中清理所有任务
 *
 * This service provides optional scheduled task cleanup functionality using cron jobs.
 * It conditionally registers a cron job based on configuration to automatically
 * remove all tasks from the database at specified intervals.
 *
 * 配置：
 * - SCHEDULE_TASK_CLEANUP_CRON：可选的cron表达式
 * - 如果没有配置，那么清理工作不会被计划
 * - 当配置后，创建并且启动一个TasksService.removeAll()的cron任务
 *
 *
 * Configuration:
 * - SCHEDULE_TASK_CLEANUP_CRON: Optional cron expression (6-field format)
 * - If not configured, the cleanup job will not be scheduled
 * - When configured, creates and starts a cron job that calls TasksService.removeAll()
 *
 * Examples:
 * - "0 * * * * *" - Every minute
 * - "0 0 * * * *" - Every hour
 * - "0 0 0 * * *" - Every day at midnight
 *
 * 这个服务会记录其初始化状态和清理结果，以便于监控
 * The service logs its initialization status and cleanup results for monitoring.
 */
@Injectable()
// 这里实现了OnModuleInit接口
export class TasksSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(TasksSchedulerService.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * 基于配置，有条件地初始化人任务清理cron
   * Conditionally initializes the task cleanup cron job based on configuration.
   *
   * 这个方法，当模块被初始化时，被NestJs自动调用。
   * 它检查环境变量中的SCHEDULE_TASK_CLEANUP_CRON，并且：
   * - 如果存在，那么启动一个cron清理任务
   * - 如果不存在，打印功能不可用，并且在没有日程计划下继续运行
   *
   *
   * This method is called automatically by NestJS when the module is initialized.
   * It checks for the SCHEDULE_TASK_CLEANUP_CRON environment variable and:
   * - If present: Creates, registers, and starts a cron job for task cleanup
   * - If absent: Logs that the feature is disabled and continues without scheduling
   *
   * 条件行为运行部署到，可选的启动/不启用自动化清理任务（在没有代码变动时）
   *
   * The conditional behavior allows deployments to optionally enable/disable
   * automatic task cleanup without code changes.
   */
  onModuleInit() {
    // 首先检查cron日程是否被环境变量所配置
    // Check if cron schedule is configured via environment variable
    const taskCleanupCron = this.configService.get<string>('SCHEDULE_TASK_CLEANUP_CRON');
    if (!taskCleanupCron) {
      // Feature is disabled - log and exit early
      // 如果没有配置，那么打印日志并且提前退出
      this.logger.log('SCHEDULE_TASK_CLEANUP_CRON not configured - task cleanup job will not be scheduled');
      return;
    }

    this.logger.log(`Initializing task cleanup cron job with schedule: ${taskCleanupCron}`);

    // Create cron job that will call our cleanup handler 创建cron工作，将会调用我们的cleanup handler
    const job = new CronJob(taskCleanupCron, () => {
      void this.handleTaskCleanup();
    });

    // Register the job with NestJS scheduler and start it 使用NestJs注册job并启动
    this.schedulerRegistry.addCronJob('cleanup-tasks', job); // 注册
    job.start(); // 启动

    this.logger.log('Task cleanup cron job initialized and started');
  }

  /**
   * 执行日程任务清理操作
   * Executes the scheduled task cleanup operation.
   *
   * 这个方法根据配置中的周期被cron job自动调用
   * 它执行下面这些操作
   * 1. 记录清理任务的启动日志
   * 2. 调用TasksService.removeAll()来删除数据库中的全部任务
   * 3. 打印被成功移除的任务数
   * 4. 捕获和记录清理期间的任何意外错误
   * 5. 记录清理进程的完结
   *
   * This method is called automatically by the cron job at the configured intervals.
   * It performs the following operations:
   * 1. Logs the start of the cleanup process
   * 2. Calls TasksService.removeAll() to delete all tasks from the database
   * 3. Logs the number of tasks successfully removed
   * 4. Handles and logs any errors that occur during cleanup
   * 5. Logs the completion of the cleanup process
   *
   * 错误捕获确保失败不会导致应用崩溃，并且为了监控和debugging，所有的清理尝试都会被记录
   * Error handling ensures that failures don't crash the application and
   * all cleanup attempts are logged for monitoring and debugging.
   */
  async handleTaskCleanup(): Promise<void> {
    this.logger.log('> handleTaskCleanup - Starting scheduled task cleanup');

    try {
      // Remove all tasks from the database
      const deletedCount = await this.tasksService.removeAll();
      this.logger.log(`handleTaskCleanup - Successfully removed ${deletedCount} tasks`);
    } catch (error) {
      // Log errors but don't throw - keeps the cron job running
      // 记录下错误，但是不抛出异常，保持cron任务继续运行
      this.logger.error('handleTaskCleanup - Error occurred during task cleanup', error);
    }

    this.logger.log('< handleTaskCleanup - Completed scheduled task cleanup');
  }
}
