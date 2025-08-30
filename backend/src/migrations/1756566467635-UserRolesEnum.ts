import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRolesEnum1756566467635 implements MigrationInterface {
    name = 'UserRolesEnum1756566467635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_result" ALTER COLUMN "value" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_result" ALTER COLUMN "value" SET NOT NULL`);
    }

}
