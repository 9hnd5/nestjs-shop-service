import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660529017032 implements MigrationInterface {
    name = 'initDb1660529017032';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`tax\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`tax\``);
    }
}
