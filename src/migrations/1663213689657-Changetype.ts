import { MigrationInterface, QueryRunner } from 'typeorm';

export class Changetype1663213689657 implements MigrationInterface {
    name = 'Changetype1663213689657';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`weight\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`weight\` double NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`length\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`length\` double NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`width\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`width\` double NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`height\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`height\` double NOT NULL DEFAULT '0'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`height\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`height\` int NOT NULL DEFAULT '0'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`width\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`width\` decimal(18,4) NOT NULL DEFAULT '0.0000'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`length\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`length\` decimal(18,4) NOT NULL DEFAULT '0.0000'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`weight\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`weight\` decimal(18,4) NOT NULL DEFAULT '0.0000'`
        );
    }
}
