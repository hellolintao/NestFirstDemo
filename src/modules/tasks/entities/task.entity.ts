/**
 * 实体是数据库和TS之间的一个映射
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { TaskPriority } from '../../reference-data/entities/task-priority.entity';

/**
 * 代表了系统中的一个任务
 * Represents a task in the system.
 *
 * 任务的每个工作项都是可以被追踪了，配备了可选的截止时间和描述。
 * 每个任务的维护了用于审计的信息（创建时间和最后更新时间）
 * Tasks are work items that can be tracked for completion with optional
 * due dates and descriptions. Each task maintains audit information about
 * when it was created and last updated.
 *
 * 在数据库中为null的可选字段（description, dueAt）将不会被纳入JSON序列化
 * 以提供清晰的API响应
 * Note: Optional fields (description, dueAt) that are null in the database
 * will be excluded from JSON serialization to provide cleaner API responses.
 */
@Entity()
export class Task {
  /**
   * 任务的唯一ID
   * Unique identifier for the task.
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'Identifier for the task' })
  // 标记自增的主键列，是一个uuid
  @PrimaryGeneratedColumn('uuid')
  id: string; // a UUID

  /**
   * 任务的简要表述
   * Brief description of what the task entails.
   * @example "Complete project documentation"
   */
  @ApiProperty({ example: 'Complete project documentation', description: 'Brief description of the task' })
  // 标记普通的数据列，类型是可变字符
  @Column({ type: 'varchar', length: 500 })
  summary: string;

  /**
   * 可选的细节描述
   * Optional detailed description providing more context about the task.
   * @example "Write comprehensive documentation for the NestJS Starter project"
   */
  @ApiProperty({
    example: 'Write comprehensive documentation for the NestJS Starter project',
    description: 'Detailed description of the task',
    required: false,
  })
  @Transform(({ value }) => (value === null ? undefined : value))
  // text类型，可为空
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * 可选的截止时间
   * Optional due date for task completion.
   * @example "2025-09-15T10:00:00.000Z"
   */
  @ApiProperty({
    example: '2025-09-15T10:00:00.000Z',
    description: 'Optional due date for task completion',
    required: false,
  })
  // 转换一下数据
  @Transform(({ value }) => (value === null ? undefined : value))
  // 普通的数据列
  @Column({ type: 'timestamp with time zone', nullable: true })
  dueAt?: Date; // Changed to Date type for better TypeORM integration

  /**
   * Indicates whether the task has been completed.
   * @example false
   */
  @ApiProperty({ example: false, description: 'Indicates if the task is complete', default: false })
  @Column({ type: 'boolean', default: false })
  isComplete: boolean;

  /**
   * The unique identifier of the user who owns this task.
   * @example "550e8400-e29b-41d4-a716-446655440002"
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Unique identifier of the user who owns this task',
  })
  @Column({ type: 'uuid' })
  userId: string;

  /**
   * 拥有该任务的用户
   * The user who owns this task.
   */
  // 关系映射，定义多对一的关系（多个任务属于一个用户）
  @ManyToOne(() => User, { nullable: false })
  // 关系映射，指定外键列
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 任务的优先级
   * The priority code for this task.
   * @example "HIGH"
   */
  @ApiProperty({
    example: 'HIGH',
    description: 'Priority code for the task',
  })
  @Column({ type: 'varchar', length: 32 })
  taskPriorityCode: string;

  /**
   * The priority for this task.
   */
  // 关系映射，定义多对一关系，多个任务属于同一个优先级
  @ManyToOne(() => TaskPriority, { nullable: false, eager: true })
  // 关联外键
  @JoinColumn({ name: 'taskPriorityCode' })
  taskPriority: TaskPriority;

  /**
   * Timestamp when the task was created.
   * @example "2025-09-01T08:00:00.000Z"
   */
  @ApiProperty({ example: '2025-09-01T08:00:00.000Z', description: 'Timestamp when the task was created' })
  // 自动填充创建时间
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date; // Changed to Date type for better TypeORM integration

  /**
   * Optional timestamp when the task was last updated.
   * @example "2025-09-02T09:30:00.000Z"
   */
  @ApiProperty({
    example: '2025-09-02T09:30:00.000Z',
    description: 'Timestamp when the task was last updated',
    required: false,
  })
  // 自动填充更新时间
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date; // Changed to Date type for better TypeORM integration
}
