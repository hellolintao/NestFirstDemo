/**
 * 在这个项目中，dto用来
 * 1. 数据验证（自动验证和错误聚合）
 * 2. 类型安全（TS智能提示）
 * 3. 数据转换与序列化（控制返回给客户端的数据结构），例如@Exclude()、@Transform()、@Expose()
 * 4. 接口契约与 API 文档生成
 * 5. 解耦内外层结构（架构防腐）即便数据库表结构重构（如字段改名、分表），只要 DTO 接口不变，前端无需任何改动。DTO 充当了内部领域模型和外部请求之间的“防腐层”。
 */

// swagger的api
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTaskParamsDto {
  // 声明文档相关的内容
  @ApiProperty({
    name: 'taskId',
    description: 'Identifier for a task',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  // 使用这个装饰器，第一个参数是版本，第二个参数是如果验证失败的提示
  @IsUUID(4, { message: 'taskId must be a valid UUID' })
  // 非空验证
  @IsNotEmpty({ message: 'taskId is required' })
  taskId: string;
}
