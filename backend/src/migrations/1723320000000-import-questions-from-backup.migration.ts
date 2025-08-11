import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImportQuestionsFromBackup1723320000000 implements MigrationInterface {
  name = 'ImportQuestionsFromBackup1723320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Execute helper SQL with full hardcoded dataset
    await queryRunner.query(`\nDO $$ BEGIN END $$;\n`); // no-op to ensure transactional safety start
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.resolve(__dirname, '1723320000000-import-questions-from-backup.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error('Helper SQL not found: ' + sqlPath);
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM public."question_single_result_option"');
    await queryRunner.query('DELETE FROM public."question_single_result"');
    await queryRunner.query('DELETE FROM public."question_single_option"');
    await queryRunner.query('DELETE FROM public."question_single"');
    await queryRunner.query('DELETE FROM public."question"');
  }
}


