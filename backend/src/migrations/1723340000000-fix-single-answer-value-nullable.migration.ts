import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSingleAnswerValueNullable1723340000000
  implements MigrationInterface
{
  name = 'FixSingleAnswerValueNullable1723340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modifica la colonna value nella tabella single_answer per permettere valori NULL
    await queryRunner.query(
      `ALTER TABLE "single_answer" ALTER COLUMN "value" DROP NOT NULL`,
    );

    // Imposta a NULL tutti i valori uguali a 0
    // ad eccezione di quelli che provengono da domande con controlType = 'dropdown' e valueType = 'number'
    await queryRunner.query(`
      UPDATE "single_answer" sa
      SET "value" = NULL
      WHERE sa."value" = 0
        AND NOT EXISTS (
          SELECT 1
          FROM "answer" a
          JOIN "question" q ON q."questionnaire" = a."questionnaire"
          JOIN "question_single" qs ON qs."questionId" = q."id" AND qs."key" = sa."key"
          WHERE a."id" = sa."answerId"
            AND qs."controlType" = 'dropdown'
            AND qs."valueType" = 'number'
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Ripristina il vincolo NOT NULL se necessario
    // prima perà tutti i valori null devono diventare "0"
    await queryRunner.query(
      `UPDATE "single_answer" SET "value" = 0 WHERE "value" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_answer" ALTER COLUMN "value" SET NOT NULL`,
    );
  }
}
