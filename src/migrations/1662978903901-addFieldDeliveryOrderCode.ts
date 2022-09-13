import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFieldDeliveryOrderCode1662978903901 implements MigrationInterface {
    name = 'addFieldDeliveryOrderCode1662978903901';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`delivery_order_code\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`delivery_order_code\``);
    }
}
