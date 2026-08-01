/**
 * 在这个项目中，dto用来
 * 1. 数据验证（自动验证和错误聚合）
 * 2. 类型安全（TS智能提示）
 * 3. 数据转换与序列化（控制返回给客户端的数据结构），例如@Exclude()、@Transform()、@Expose()
 * 4. 接口契约与 API 文档生成
 * 5. 解耦内外层结构（架构防腐）即便数据库表结构重构（如字段改名、分表），只要 DTO 接口不变，前端无需任何改动。DTO 充当了内部领域模型和外部请求之间的“防腐层”。
 */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetTasksQueryDto {
  /**
   * 文档的装饰器
   * 分页的页码（是一个可选参数），如果提供了，API将会返回分页后的数据，如果不提供，返回全部任务
   * Page number for pagination. If provided, the API will return paginated results.
   * If not provided, all tasks will be returned.
   * @example 1
   */
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination (1-indexed). If omitted, all tasks are returned.',
    required: false,
    minimum: 1,
  })
  // 检查这个是否有这个参数，如果没有，那么跳过全部的验证
  @IsOptional()
  // 必须是数字
  @Type(() => Number)
  // 必须是整数
  @IsInt({ message: 'page must be an integer' })
  // 最小值是1
  @Min(1, { message: 'page must be at least 1' })
  page?: number;

  /**
   * 每页的数据量。如果页码指定但是没指定数据量，那么默认是10
   * Number of tasks to return per page. Defaults to 10 if page is specified but pageSize is not.
   * @example 10
   */
  @ApiProperty({
    example: 10,
    description: 'Number of tasks per page. Defaults to 10 if not provided when page is specified.',
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize must be an integer' })
  @Min(1, { message: 'pageSize must be at least 1' })
  pageSize?: number;
}
