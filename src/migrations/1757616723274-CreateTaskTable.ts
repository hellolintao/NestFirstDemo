/**
 * 创建任务表
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

// 迁移程序实现MigrationInterface接口
export class CreateTaskTable1757616723274 implements MigrationInterface {
  // 迁移名
  name = 'CreateTaskTable1757616723274';

  // 迁移
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * task表
     * - id uuid 不为空 并默认生成
     * - summary 字符 最大长度500 character是定长字符串，varying变长字符串但是有上限
     * - description text text变长字符串但是无上限
     * - dueAt 时间戳
     * - isComplete boolean类型 不为空 默认false
     * - createdAt 时间戳 不为空 默认现在
     * - updatedAt 时间戳 不为空 默认现在
     * - CONSTRAINT 表示建立一个规则，表示建立一个名为PK_fb213f79ee45060ba925ecd576e的主键约束，保证id是唯一的
     */
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "summary" character varying(500) NOT NULL, "description" text, "dueAt" TIMESTAMP WITH TIME ZONE, "isComplete" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
  }

  // 反向迁移（销毁这个表）
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
