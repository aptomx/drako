import { MigrationInterface, QueryRunner } from 'typeorm';

export class TodoAddDeleteAt1699052292991 implements MigrationInterface {
  name = 'TodoAddDeleteAt1699052292991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" DROP COLUMN "deletedAt"`);
  }
}
