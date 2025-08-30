import { MigrationInterface, QueryRunner } from 'typeorm';

export class TimeStampZ1756594109677 implements MigrationInterface {
  name = 'TimeStampZ1756594109677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Safely alter the column type while preserving data
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE USING "createdAt"::timestamp with time zone`,
    );

    // Update the default value to use proper PostgreSQL syntax
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to the original type
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "createdAt" TYPE TIMESTAMP USING "createdAt"::timestamp`,
    );

    // Restore the original default
    await queryRunner.query(
      `ALTER TABLE "answer" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
