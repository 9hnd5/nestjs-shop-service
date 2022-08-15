import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660528461108 implements MigrationInterface {
    name = 'initDb1660528461108';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`total_before_discount\` int NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`total_line_discount\` int NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`total_line_discount\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` DROP COLUMN \`total_before_discount\``
        );
    }
}
