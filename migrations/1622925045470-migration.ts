import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1622925045470 implements MigrationInterface {
  name = 'migration1622925045470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "login" TO "username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "login"`);
  }
}
