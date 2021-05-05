import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1620230318287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "group"(name, permissions) VALUES
        ('reader', ARRAY['READ', 'SHARE']),
        ('editor', ARRAY['READ', 'WRITE', 'UPLOAD_FILES']),
        ('admin', ARRAY['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "group"`);
  }
}
