import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1620119712938 implements MigrationInterface {
  name = 'migration1620119712938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "permissions" text array NOT NULL, CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_users_user" ("groupId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e075467711f75a7f49fb79c79ef" PRIMARY KEY ("groupId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fe6cce7d479552c17823e267af" ON "group_users_user" ("groupId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55edea38fece215a3b66443a49" ON "group_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "group_users_user" ADD CONSTRAINT "FK_fe6cce7d479552c17823e267aff" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_users_user" ADD CONSTRAINT "FK_55edea38fece215a3b66443a498" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_users_user" DROP CONSTRAINT "FK_55edea38fece215a3b66443a498"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_users_user" DROP CONSTRAINT "FK_fe6cce7d479552c17823e267aff"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_55edea38fece215a3b66443a49"`);
    await queryRunner.query(`DROP INDEX "IDX_fe6cce7d479552c17823e267af"`);
    await queryRunner.query(`DROP TABLE "group_users_user"`);
    await queryRunner.query(`DROP TABLE "group"`);
  }
}
