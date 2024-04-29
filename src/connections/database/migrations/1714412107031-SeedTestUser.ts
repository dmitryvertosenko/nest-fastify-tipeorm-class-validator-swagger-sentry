import { MigrationInterface, QueryRunner } from 'typeorm';
import { UsersMigrationsProvider } from 'modules/users/providers/users-migrations.provider';

export class SeedTestUser1714412107031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(UsersMigrationsProvider.seedTestUser.createQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(UsersMigrationsProvider.seedTestUser.dropQuery);
  }
}
