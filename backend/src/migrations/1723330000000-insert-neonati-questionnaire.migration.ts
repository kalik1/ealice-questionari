import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class InsertNeonatiQuestionnaire1723330000000
  implements MigrationInterface
{
  name = 'InsertNeonatiQuestionnaire1723330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sqlPath = path.resolve(
      __dirname,
      '1723330000000-insert-neonati-questionnaire.sql',
    );
    if (!fs.existsSync(sqlPath)) {
      throw new Error('Helper SQL not found: ' + sqlPath);
    }
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in correct order to respect foreign key constraints
    // 1. Delete question_single_result_option records
    await queryRunner.query(
      `DELETE FROM public."question_single_result_option" WHERE "singleQuestionId" IN (SELECT id FROM public."question_single_result" WHERE "questionId" IN (SELECT id FROM public."question" WHERE questionnaire = 'neonati'))`,
    );
    // 2. Delete question_single_result records
    await queryRunner.query(
      `DELETE FROM public."question_single_result" WHERE "questionId" IN (SELECT id FROM public."question" WHERE questionnaire = 'neonati')`,
    );
    // 3. Delete question_single_option records
    await queryRunner.query(
      `DELETE FROM public."question_single_option" WHERE "singleQuestionId" IN (SELECT id FROM public."question_single" WHERE "questionId" IN (SELECT id FROM public."question" WHERE questionnaire = 'neonati'))`,
    );
    // 4. Delete question_single records
    await queryRunner.query(
      `DELETE FROM public."question_single" WHERE "questionId" IN (SELECT id FROM public."question" WHERE questionnaire = 'neonati')`,
    );
    // 5. Delete main question record
    await queryRunner.query(
      `DELETE FROM public."question" WHERE questionnaire = 'neonati'`,
    );
  }
}
