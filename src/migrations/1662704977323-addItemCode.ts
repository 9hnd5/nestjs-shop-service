import { MigrationInterface, QueryRunner } from 'typeorm';

export class addItemCode1662704977323 implements MigrationInterface {
    name = 'addItemCode1662704977323';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`item_code\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`item_name\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`promotion_code\` varchar(50) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`promotion_code\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`item_name\``);
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`item_code\``);
    }
}
