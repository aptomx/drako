import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthLogs1695925407003 implements MigrationInterface {
  name = 'AuthLogs1695925407003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_logs" ("id" SERIAL NOT NULL, "email" character varying(255), "ip" character varying(255) NOT NULL, "userAgent" character varying(255) NOT NULL, "status" character varying(255) NOT NULL, "error" character varying(255), "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4ee581a4a56f10b64ffbfc1779" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_logs"`);
  }
}
