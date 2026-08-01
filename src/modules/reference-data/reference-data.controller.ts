import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TaskPriority } from './entities/task-priority.entity';
import { GetTaskPriorityParamsDto } from './dto/get-task-priority-params.dto';
import { TaskPriorityService } from './task-priority.service';

@ApiTags('Reference Data')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'refdata', version: '1' })
export class ReferenceDataController {
  private readonly logger = new Logger(ReferenceDataController.name);

  constructor(private readonly taskPriorityService: TaskPriorityService) {}

  @Get('taskpriorities')
  @HttpCode(HttpStatus.OK) // 强制这个接口返回指定的HTTP状态码
  @ApiOperation({ summary: 'Fetch all task priority levels' })
  @ApiOkResponse({ description: 'List of all task priority levels', type: [TaskPriority] })
  async getTaskPriorities(): Promise<TaskPriority[]> {
    this.logger.log('> getTaskPriorities');
    const taskPriorities = await this.taskPriorityService.findAll();
    this.logger.log('< getTaskPriorities');
    return taskPriorities;
  }

  @Get('taskpriorities/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch a specific task priority level by its code' })
  @ApiOkResponse({ description: 'The task priority level with the specified code', type: TaskPriority })
  @ApiNotFoundResponse({ description: 'Task priority level not found' })
  // 注意下面使用了一个管道，这个管道可以将参数中传过来的字符串转换成真正的值，例如将“1”-> 1
  async getTaskPriority(
    @Param(new ValidationPipe({ transform: true })) params: GetTaskPriorityParamsDto,
  ): Promise<TaskPriority> {
    this.logger.log(`> getTaskPriority: ${params.code}`);
    const taskPriority = await this.taskPriorityService.findOne(params.code);
    this.logger.log(`< getTaskPriority: ${params.code}`);
    return taskPriority;
  }
}
