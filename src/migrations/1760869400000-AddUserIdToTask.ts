/**
 * 添加用户ID到任务表
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToTask1760869400000 implements MigrationInterface {
  name = 'AddUserIdToTask1760869400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ALTER 修改表结构的关键字
    // 修改task表，增加userId字段，字段是uuid且不为空
    // Add userId column to task table
    await queryRunner.query(`ALTER TABLE "task" ADD "userId" uuid NOT NULL`);

    /**
     * 修改task表，增加一个FK_f316d3fe53497d4d8a2957db8b9规则
     * task表的外键是userId
     * 外键参考的是user表中的id
     * task.userID必须引用一个真实存在的user.id
     * 当user表删除或者更新数据的时候，如果user.id被task所引用，那么操作会被拒绝，从而保证数据的完整性，（NO ACTION 表示不采取任何自动操作）
     */
    // Add foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // 在task表上，为userId创建IDX_f316d3fe53497d4d8a2957db8b9索引，以提高性能
    // Add index for better query performance
    await queryRunner.query(`CREATE INDEX "IDX_f316d3fe53497d4d8a2957db8b9" ON "task" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除索引
    // Drop index
    await queryRunner.query(`DROP INDEX "IDX_f316d3fe53497d4d8a2957db8b9"`);

    // 删除关联规则
    // Drop foreign key constraint
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);

    // 删除task表中新增的userId字段
    // Drop userId column
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "userId"`);
  }
}
