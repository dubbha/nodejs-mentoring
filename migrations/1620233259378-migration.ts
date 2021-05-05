import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1620233259378 implements MigrationInterface {
  name = 'migration1620233259378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migrating a column to/from `enum` is tricky in case data already exists in the table.
    // When switching a column from `text` to `enum` auto-generated migration does
    // `DROP COLUMN` + `ADD column enum`, resetting all the values to the default (e.g. {READ} below).
    // To avoid this, we need Data Migration: preserve the data, cleanup the table, restore the data.
    // We must also preserve and restore the data of the join table, because cleanup cascades to it too.

    // preserve data, cleanup
    const data = await queryRunner.query(`SELECT * from "group"`);
    const joinTableData = await queryRunner.query(`SELECT * from "group_users_user"`);
    await queryRunner.query(`DELETE FROM "group"`); // cascades to join table too

    // auto-generated migration part
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "permissions"`);
    await queryRunner.query(
      `CREATE TYPE "group_permissions_enum" AS ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')`,
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD "permissions" "group_permissions_enum" array NOT NULL DEFAULT '{READ}'`,
    );

    // restore data
    await queryRunner.manager.insert('group', data);
    await queryRunner.manager.insert('group_users_user', joinTableData);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // When switching a column back from `enum` to `text` auto-generated migration does
    // `DROP COLUMN` + `ADD column text`, the values become null in a NOT NULL column, thus rollback fails.
    // To avoid this, we again need Data Migration.

    // preserve data, cleanup
    const data = await queryRunner.query(`SELECT * from "group"`);
    const joinTableData = await queryRunner.query(`SELECT * from "group_users_user"`);
    await queryRunner.query(`DELETE FROM "group"`);

    // auto-generated migration part
    await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "permissions"`);
    await queryRunner.query(`DROP TYPE "group_permissions_enum"`);
    await queryRunner.query(`ALTER TABLE "group" ADD "permissions" text array NOT NULL`);

    // restore data
    await queryRunner.manager.insert('group', data);
    await queryRunner.manager.insert('group_users_user', joinTableData);
  }
}
