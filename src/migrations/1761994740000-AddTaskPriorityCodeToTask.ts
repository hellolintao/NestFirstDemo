/**
 * 增加任务优先权代码给Task
 */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskPriorityCodeToTask1761994740000 implements MigrationInterface {
  name = 'AddTaskPriorityCodeToTask1761994740000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 修改task表，增加taskPriorityCode字段
    // Add the taskPriorityCode column to the task table
    await queryRunner.query(`
      ALTER TABLE "task" 
      ADD COLUMN "taskPriorityCode" character varying(32) NOT NULL DEFAULT 'MEDIUM'
    `);

    // 更新表task，把taskPriorityCode不为空的数据项taskPriorityCode设置为MEDIUM
    // Update existing tasks to have a default priority (assuming MEDIUM exists)
    await queryRunner.query(`
      UPDATE "task" 
      SET "taskPriorityCode" = 'MEDIUM' 
      WHERE "taskPriorityCode" IS NULL
    `);

    // 修改表task，修改taskPriorityCode字段，去掉之前为他设置的默认值
    // Remove the default constraint after populating existing data
    await queryRunner.query(`
      ALTER TABLE "task" 
      ALTER COLUMN "taskPriorityCode" DROP DEFAULT
    `);

    /**
     * 修改表task。增加规则FK_task_taskPriorityCode
     * 外键task.taskPriorityCode关联task_priority.code
     * ON DELETE RESTRICT 表示，task_priority中的数据被删除时，如果task_priority.code还被task引用，那么禁止删除
     * ON UPDATE CASCADE 表示，task_priority中的数据被更新时，task表中相关的引用也会被自动同步更新，CASCADE表示小瀑布、传递的意思
     */
    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "task" 
      ADD CONSTRAINT "FK_task_taskPriorityCode" 
      FOREIGN KEY ("taskPriorityCode") 
      REFERENCES "task_priority"("code") 
      ON DELETE RESTRICT 
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 修改表task，删除规则FK_task_taskPriorityCode（外键关联）
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "task" 
      DROP CONSTRAINT "FK_task_taskPriorityCode"
    `);

    // 修改表task，删除taskPriorityCode字段
    // Drop the taskPriorityCode column
    await queryRunner.query(`
      ALTER TABLE "task" 
      DROP COLUMN "taskPriorityCode"
    `);
  }
}
