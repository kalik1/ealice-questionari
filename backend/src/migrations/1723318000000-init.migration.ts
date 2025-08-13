import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1755048876208 implements MigrationInterface {
  name = 'Init.migration1755048876208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "single_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "deletedAt" TIMESTAMP, "value" double precision, "answerId" uuid, CONSTRAINT "PK_56f9ab97560bf029708b68629fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "single_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "deletedAt" TIMESTAMP, "value" double precision NOT NULL, "answerId" uuid, CONSTRAINT "PK_2b3415ccfde8047e35440953ec6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "single_text_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "deletedAt" TIMESTAMP, "value" character varying NOT NULL, "answerId" uuid, CONSTRAINT "PK_0c504bd1b8ce90fb399cca4cbc7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionnaire" character varying NOT NULL, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deletedAt" TIMESTAMP, "patientId" uuid, "coopId" uuid, "userId" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" SERIAL NOT NULL, "yearOfBirth" integer NOT NULL, "gender" character varying NOT NULL, "notes" character varying DEFAULT '', "coopId" uuid, CONSTRAINT "PK_8dfa510bb29ad31ab2139fbfb99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_single_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "valueType" character varying NOT NULL, "key" character varying NOT NULL, "deletedAt" TIMESTAMP, "singleQuestionId" uuid, CONSTRAINT "PK_4ec0515be24ff708bba5d637592" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_single" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "valueType" character varying NOT NULL, "key" character varying, "label" character varying, "required" boolean NOT NULL DEFAULT true, "order" integer NOT NULL, "hint" character varying, "controlType" character varying NOT NULL, "type" character varying, "deletedAt" TIMESTAMP, "questionId" uuid NOT NULL, CONSTRAINT "PK_e17bc25fad6e69705850b856172" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_single_result_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "valueType" character varying NOT NULL, "key" character varying NOT NULL, "deletedAt" TIMESTAMP, "singleQuestionId" uuid, CONSTRAINT "PK_aea0b599b3ca3c2f5d09a673936" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_single_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "valueType" character varying NOT NULL, "key" character varying, "label" character varying, "required" boolean NOT NULL DEFAULT true, "order" integer NOT NULL, "hint" character varying, "controlType" character varying NOT NULL, "type" character varying, "deletedAt" TIMESTAMP, "questionId" uuid NOT NULL, CONSTRAINT "PK_f6bd968a85f7138802c0834de64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionnaire" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_c59ee2d2cd9c257ad87f330f96f" UNIQUE ("name"), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "coop" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying, CONSTRAINT "UQ_58265924a1d5084910ef1a66190" UNIQUE ("email"), CONSTRAINT "UQ_8a0720532e50f684acccf6e88f0" UNIQUE ("name"), CONSTRAINT "PK_57ae847d1e619c65dc8d844ef00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying, "role" character varying NOT NULL DEFAULT 'user', "yearOfBirth" integer NOT NULL DEFAULT '1900', "gender" character varying NOT NULL DEFAULT 'm', "password" character varying NOT NULL, "deletedAt" TIMESTAMP, "coopId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_coops_coop" ("questionId" uuid NOT NULL, "coopId" uuid NOT NULL, CONSTRAINT "PK_022919d258ca1498e6df353f444" PRIMARY KEY ("questionId", "coopId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2146ffab135a199233c5bf9" ON "question_coops_coop" ("questionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_026d8eb7f87d208b5deca9aac3" ON "question_coops_coop" ("coopId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "single_answer" ADD CONSTRAINT "FK_960bca1c8e5f16d97e79bb22896" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_result" ADD CONSTRAINT "FK_e365e6331ce2fd2cc62f56ccf04" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_text_answer" ADD CONSTRAINT "FK_e2011e2b780a37caca7257df0ca" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_f0d6edfeb8e42aa3d753e11e418" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_8a61278f25f2ec6195f603f09df" FOREIGN KEY ("coopId") REFERENCES "coop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_5a26907efcd78a856c8af5829e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" ADD CONSTRAINT "FK_4319108a3068246e7ef6f32026d" FOREIGN KEY ("coopId") REFERENCES "coop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_option" ADD CONSTRAINT "FK_46e1b483028572b569c77ee7db4" FOREIGN KEY ("singleQuestionId") REFERENCES "question_single"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single" ADD CONSTRAINT "FK_045ba212c4e3a6d208dbbcd9f15" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_result_option" ADD CONSTRAINT "FK_cff3e15bb1a61ac4b0394634396" FOREIGN KEY ("singleQuestionId") REFERENCES "question_single_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_result" ADD CONSTRAINT "FK_3f455738bfa133b9955a50d2c4c" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4e79c62d1ddb643b4047ac5cdac" FOREIGN KEY ("coopId") REFERENCES "coop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_coops_coop" ADD CONSTRAINT "FK_4be2146ffab135a199233c5bf9d" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_coops_coop" ADD CONSTRAINT "FK_026d8eb7f87d208b5deca9aac3e" FOREIGN KEY ("coopId") REFERENCES "coop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_coops_coop" DROP CONSTRAINT "FK_026d8eb7f87d208b5deca9aac3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_coops_coop" DROP CONSTRAINT "FK_4be2146ffab135a199233c5bf9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4e79c62d1ddb643b4047ac5cdac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_result" DROP CONSTRAINT "FK_3f455738bfa133b9955a50d2c4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_result_option" DROP CONSTRAINT "FK_cff3e15bb1a61ac4b0394634396"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single" DROP CONSTRAINT "FK_045ba212c4e3a6d208dbbcd9f15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_single_option" DROP CONSTRAINT "FK_46e1b483028572b569c77ee7db4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient" DROP CONSTRAINT "FK_4319108a3068246e7ef6f32026d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_5a26907efcd78a856c8af5829e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_8a61278f25f2ec6195f603f09df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_f0d6edfeb8e42aa3d753e11e418"`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_text_answer" DROP CONSTRAINT "FK_e2011e2b780a37caca7257df0ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_result" DROP CONSTRAINT "FK_e365e6331ce2fd2cc62f56ccf04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "single_answer" DROP CONSTRAINT "FK_960bca1c8e5f16d97e79bb22896"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_026d8eb7f87d208b5deca9aac3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4be2146ffab135a199233c5bf9"`,
    );
    await queryRunner.query(`DROP TABLE "question_coops_coop"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "coop"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "question_single_result"`);
    await queryRunner.query(`DROP TABLE "question_single_result_option"`);
    await queryRunner.query(`DROP TABLE "question_single"`);
    await queryRunner.query(`DROP TABLE "question_single_option"`);
    await queryRunner.query(`DROP TABLE "patient"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "single_text_answer"`);
    await queryRunner.query(`DROP TABLE "single_result"`);
    await queryRunner.query(`DROP TABLE "single_answer"`);
  }
}
