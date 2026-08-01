import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { TaskPriority } from './entities/task-priority.entity';

@Injectable()
export class TaskPriorityService {
  private readonly logger = new Logger(TaskPriorityService.name); // 日志
  private readonly CACHE_TTL = 300000; // 5 minutes in milliseconds 5分钟（毫秒计）
  private readonly CACHE_KEY_ALL = 'task-priorities:all'; // 缓存全部任务
  private readonly CACHE_KEY_ONE = 'task-priority:'; // 缓存一个任务

  constructor(
    @InjectRepository(TaskPriority) // 注入这个实体给taskPriorityRepository
    private readonly taskPriorityRepository: Repository<TaskPriority>,
    @Inject(CACHE_MANAGER) // 注入缓存管理器给cacheManager
    private readonly cacheManager: Cache,
  ) {}

  // 查找全部任务
  async findAll(): Promise<TaskPriority[]> {
    this.logger.log('> findAll');

    // Try to get from cache first 尝试先从缓存中读取。这里的缓存可能是存在内存里的，后续可以配置专门用于缓存的软件，例如Redis
    const cached = await this.cacheManager.get<TaskPriority[]>(this.CACHE_KEY_ALL);
    if (cached) {
      this.logger.debug(`findAll: returning ${cached.length} task priorities from cache`);
      this.logger.log('< findAll (cached)');
      return cached;
    }

    // If not in cache, fetch from database 如果缓存中没有，那么从数据库中获取
    const taskPriorities = await this.taskPriorityRepository.find({
      order: { ordinal: 'ASC', code: 'ASC' },
    });

    // Cache the result 缓存结果
    await this.cacheManager.set(this.CACHE_KEY_ALL, taskPriorities, this.CACHE_TTL);

    this.logger.debug(`findAll: returning ${taskPriorities.length} task priorities from database`);
    this.logger.log('< findAll');
    return taskPriorities;
  }

  // 查找一个具体的任务
  async findOne(code: string): Promise<TaskPriority> {
    this.logger.log(`> findOne: ${code}`);

    const cacheKey = `${this.CACHE_KEY_ONE}${code}`;

    // Try to get from cache first
    const cached = await this.cacheManager.get<TaskPriority>(cacheKey);
    if (cached) {
      this.logger.debug(`findOne: ${code} found in cache`);
      this.logger.log(`< findOne: ${code} (cached)`);
      return cached;
    }

    // If not in cache, fetch from database
    const taskPriority = await this.taskPriorityRepository.findOne({ where: { code } });
    this.logger.debug(`findOne: ${code} found: ${!!taskPriority}`);

    if (!taskPriority) {
      this.logger.warn(`TaskPriority with code ${code} not found`);
      throw new NotFoundException(`TaskPriority with code ${code} not found`);
    }

    // Cache the result
    await this.cacheManager.set(cacheKey, taskPriority, this.CACHE_TTL);

    this.logger.log(`< findOne: ${code}`);
    return taskPriority;
  }
}
