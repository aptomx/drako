import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1695150925553 implements MigrationInterface {
  name = 'Init1695150925553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "modules" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "module_permissions" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "moduleId" integer NOT NULL, "view" boolean NOT NULL DEFAULT false, "edit" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf5fcec22f78b73d1945ae9ec4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "roleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_472b25323af01488f1f66a06b6" UNIQUE ("userId"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255), "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "fullName" character varying(255) NOT NULL, "phone" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "emailVerified" boolean NOT NULL DEFAULT false, "photo" text, "driver" character varying(255), "token" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recovery_codes" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "token" text, "type" character varying(255) NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0723b9e53961e799027d7f7ba32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo" ("id" SERIAL NOT NULL, "content" character varying(255), "isDone" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "module_permissions" ADD CONSTRAINT "FK_24028763c392b8361f32799bd3c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "module_permissions" ADD CONSTRAINT "FK_ff98ac927f03e2bc7500b365c06" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery_codes" ADD CONSTRAINT "FK_5ab5f51b1ca8fcc0073d76fd3d9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recovery_codes" DROP CONSTRAINT "FK_5ab5f51b1ca8fcc0073d76fd3d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "module_permissions" DROP CONSTRAINT "FK_ff98ac927f03e2bc7500b365c06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "module_permissions" DROP CONSTRAINT "FK_24028763c392b8361f32799bd3c"`,
    );
    await queryRunner.query(`DROP TABLE "todo"`);
    await queryRunner.query(`DROP TABLE "recovery_codes"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "module_permissions"`);
    await queryRunner.query(`DROP TABLE "modules"`);
  }
}
