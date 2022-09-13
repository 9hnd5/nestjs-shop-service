import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateFieldSalesOrder1662975958660 implements MigrationInterface {
    name = 'updateFieldSalesOrder1662975958660';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`payment_type\` varchar(255) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`service_level\` varchar(255) NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`item_type\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`item_type\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`service_level\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`payment_type\``);
    }
}
