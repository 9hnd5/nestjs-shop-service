import { MigrationInterface, QueryRunner } from 'typeorm';

export class promoDesc1662977114887 implements MigrationInterface {
    name = 'promoDesc1662977114887';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`promotion_description\` varchar(1000) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` DROP COLUMN \`promotion_description\``
        );
    }
}
