/**
 * 用户数据库实体
 */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * The User entity.
 */
@Entity('user')
export class User {
  /**
   * Unique identifier for the user.
   * @example "550e8400-e29b-41d4-a716-446655440001"
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Identifier for the user',
  })
  @PrimaryGeneratedColumn('uuid') // 自动生成的主键
  id: string;

  /**
   * Subject identifier for the user used in JWT tokens.
   * @example "b7a9c8d5-e2f1-4a3b-9c7d-6e5f4a3b2c1d"
   */
  @ApiProperty({
    example: 'b7a9c8d5-e2f1-4a3b-9c7d-6e5f4a3b2c1d',
    description: 'Subject identifier for the user used in authentication tokens',
  })
  @Column({ type: 'uuid', unique: true }) // 普通数据列
  @Index('IX_user_sub', { unique: true }) // 建立对这个字段的索引
  sub: string;

  /**
   * First name of the user.
   * @example "John"
   */
  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  /**
   * Last name of the user.
   * @example "Doe"
   */
  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  /**
   * Email address of the user.
   * @example "john.doe@example.com"
   */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  /**
   * Unique username for the user account.
   * @example "johndoe"
   */
  @ApiProperty({
    example: 'johndoe',
    description: 'Username for the user account',
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  @Index('IX_user_username', { unique: true }) // 建立索引
  username: string;

  /**
   * The salt used to encrypt the password. 用户加密密码的盐值
   */
  @Exclude({ toPlainOnly: true }) // 这里表示，标记这个字段在序列化/反序列化的时候被排除，也就是将数据转化为JSON的时候进行排除
  @Column({ type: 'varchar', length: 255 })
  passwordSalt: string;

  /**
   * The hashed version of the password. 密码的hash版本
   */
  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  /**
   * Timestamp when the user was created.
   * @example "2023-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Timestamp when the user was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Timestamp when the user was last updated.
   * @example "2023-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Timestamp when the user was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
