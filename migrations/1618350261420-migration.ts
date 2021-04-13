import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1618350261420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public."user"(id, login, password, age) VALUES ('fba97ebf-878d-47dd-a333-33e4c6e65bcc', '1login', 'password123', 18);`,
    );
    await queryRunner.query(
      `INSERT INTO public."user"(id, login, password, age) VALUES ('e08001a6-f799-4eaa-9a43-5b33021e1703', 'login', 'password234', 24);`,
    );
    await queryRunner.query(
      `INSERT INTO public."user"(id, login, password, age) VALUES ('ad37d6d0-2386-47eb-a649-45c4be30ac43', 'login2', 'password345', 88);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
