/**
 * 在这个项目中，dto用来
 * 1. 数据验证（自动验证和错误聚合）
 * 2. 类型安全（TS智能提示）
 * 3. 数据转换与序列化（控制返回给客户端的数据结构），例如@Exclude()、@Transform()、@Expose()
 * 4. 接口契约与 API 文档生成
 * 5. 解耦内外层结构（架构防腐）即便数据库表结构重构（如字段改名、分表），只要 DTO 接口不变，前端无需任何改动。DTO 充当了内部领域模型和外部请求之间的“防腐层”。
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  /**
   * 任务的简单描述
   * Brief description of what the task entails.
   * @example "Complete project documentation"
   */
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'Brief description of the task',
    maxLength: 500,
  })
  @IsString({ message: 'summary must be a string' })
  @IsNotEmpty({ message: 'summary is required' })
  @MaxLength(500, { message: 'summary must not exceed 500 characters' })
  summary: string;

  /**
   * 提供更多关于任务细节的上下文
   * Optional detailed description providing more context about the task.
   * @example "Write comprehensive documentation for the NestJS Starter project"
   */
  @ApiProperty({
    example: 'Write comprehensive documentation for the NestJS Starter project',
    description: 'Detailed description of the task',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description?: string;

  /**
   * 任务完成的可选截止时间
   * Optional due date for task completion.
   * @example "2025-09-15T10:00:00.000Z"
   */
  @ApiProperty({
    example: '2025-09-15T10:00:00.000Z',
    description: 'Optional due date for task completion',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'dueAt must be a valid ISO 8601 date string' })
  dueAt?: string;

  /**
   * 任务是否完成的指示器
   * Indicates whether the task has been completed.
   * @example false
   */
  @ApiProperty({
    example: false,
    description: 'Indicates if the task is complete',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isComplete must be a boolean' })
  isComplete?: boolean;

  /**
   * 任务的优先级代码
   * Priority code for the task.
   * @example "HIGH"
   */
  @ApiProperty({
    example: 'HIGH',
    description: 'Priority code for the task',
    maxLength: 32,
  })
  @IsString({ message: 'taskPriorityCode must be a string' })
  @IsNotEmpty({ message: 'taskPriorityCode is required' })
  @MaxLength(32, { message: 'taskPriorityCode must not exceed 32 characters' })
  taskPriorityCode: string;
}
