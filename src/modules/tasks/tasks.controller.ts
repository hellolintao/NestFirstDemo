/**
 * 任务模块的controller
 */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskParamsDto } from './dto/get-task-params.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { Paginated } from '../../common/types/paginated.type';

// 文档标签
@ApiTags('Tasks')
// 带权限的接口
@ApiBearerAuth()
// 使用拦截器，自动的将返回数据中不该漏的数据、改名的数据一次性处理干净
@UseInterceptors(ClassSerializerInterceptor)
// 路径和版本
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  // 创建日志实例
  private readonly logger = new Logger(TasksController.name);

  // 注入这个服务
  constructor(private readonly tasksService: TasksService) {}

  // Post请求
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // 文档描述
  @ApiOperation({ summary: 'Create a new task' })
  // 文档创建一个响应实体
  @ApiCreatedResponse({ description: 'The task has been successfully created', type: Task })
  /**
   * @Body是一个参数装饰器，它可以从请求中拿到请求体，然后创建一个验证管道实例new ValidationPipe({ transform: true })，用来校验是否符合createTaskDto，transform: true表示将字符串转成对象
   * @AuthUser是自定义装饰器，
   */
  async create(
    // 处理入参
    @Body(new ValidationPipe({ transform: true })) createTaskDto: CreateTaskDto,
    @AuthUser('id') userId: string, // 拿到用户id
  ): Promise<Task> {
    this.logger.log('> create');
    const task = await this.tasksService.create(createTaskDto, userId); // 调用创建服务
    this.logger.log('< create');
    return task;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all tasks or a paginated list of tasks' })
  @ApiResponse({
    status: 200,
    description: 'List of all tasks for the authenticated user, or a paginated response if page parameter is provided',
  })
  // 查找全部任务
  async findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetTasksQueryDto,
    @AuthUser('id') userId: string,
  ): Promise<Task[] | Paginated<Task>> {
    this.logger.log('> findAll');
    const tasks = await this.tasksService.findAll(userId, query.page, query.pageSize);
    this.logger.log('< findAll');
    return tasks;
  }

  // 查找具体任务
  @Get(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch a specific task by its ID' })
  @ApiOkResponse({ description: 'The task with the specified ID', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async findOne(
    @Param(new ValidationPipe({ transform: true })) params: GetTaskParamsDto,
    @AuthUser('id') userId: string,
  ): Promise<Task> {
    this.logger.log(`> findOne: ${params.taskId}`);
    const task = await this.tasksService.findOne(params.taskId, userId);
    this.logger.log(`< findOne: ${params.taskId}`);
    return task;
  }

  // 更新
  @Put(':taskId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a specific task by its ID' })
  @ApiOkResponse({ description: 'The task has been successfully updated', type: Task })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async update(
    @Param(new ValidationPipe({ transform: true })) params: GetTaskParamsDto,
    @Body(new ValidationPipe({ transform: true })) updateTaskDto: UpdateTaskDto,
    @AuthUser('id') userId: string,
  ): Promise<Task> {
    this.logger.log(`> update: ${params.taskId}`);
    const task = await this.tasksService.update(params.taskId, updateTaskDto, userId);
    this.logger.log(`< update: ${params.taskId}`);
    return task;
  }

  // 移除
  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a specific task by its ID' })
  @ApiNoContentResponse({ description: 'The task has been successfully removed' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async remove(
    @Param(new ValidationPipe({ transform: true })) params: GetTaskParamsDto,
    @AuthUser('id') userId: string,
  ): Promise<void> {
    this.logger.log(`> remove: ${params.taskId}`);
    await this.tasksService.remove(params.taskId, userId);
    this.logger.log(`< remove: ${params.taskId}`);
  }
}
