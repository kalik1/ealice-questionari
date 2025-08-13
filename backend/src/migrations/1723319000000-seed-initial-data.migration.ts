import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1723319000000 implements MigrationInterface {
  name = 'SeedInitialData1723319000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@coop-questionari.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';
    const coopName = process.env.DEFAULT_COOP_NAME || 'Default Cooperative';
    const coopEmail =
      process.env.DEFAULT_COOP_EMAIL || 'default@coop-questionari.com';

    // Create default coop if missing
    const coop = await queryRunner.query(
      'SELECT id FROM public.coop WHERE name = $1',
      [coopName],
    );
    let coopId: string;
    if (coop.length === 0) {
      const res = await queryRunner.query(
        'INSERT INTO public.coop (name, email) VALUES ($1, $2) RETURNING id',
        [coopName, coopEmail],
      );
      coopId = res[0].id;
    } else {
      coopId = coop[0].id;
    }

    // Ensure uuid-ossp exists for id generation
    await queryRunner.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public',
    );

    // Create admin user if missing (with plaintext default; app is expected to enforce change/login)
    const user = await queryRunner.query(
      'SELECT id FROM public."user" WHERE email = $1',
      [adminEmail],
    );
    if (user.length === 0) {
      await queryRunner.query(
        'INSERT INTO public."user" (email, password, role, "coopId", name, "yearOfBirth", gender) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [adminEmail, adminPassword, 'admin', coopId, adminName, 1990, 'm'],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@coop-questionari.com';
    await queryRunner.query('DELETE FROM public."user" WHERE email = $1', [
      adminEmail,
    ]);
    // Optionally remove coop if it has no users
  }
}
