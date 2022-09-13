import { MigrationInterface, QueryRunner } from 'typeorm';

export class reducedAmount1663053366538 implements MigrationInterface {
    name = 'reducedAmount1663053366538';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`total_reduced_amount\` double NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`original_price\` double NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`original_price\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`total_reduced_amount\``);
    }
}
