import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660470406461 implements MigrationInterface {
    name = 'initDb1660470406461';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`code\` \`code\` varchar(50) NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`status\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`status\` enum ('Draft', 'New', 'Confirmed', 'OrderPreparation', 'WaitingDelivery', 'Delivered', 'Canceled', 'Returned') NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`payment_status\` \`payment_status\` enum ('Paid', 'Unpaid') NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`payment_status\` \`payment_status\` enum ('Paid', 'Unpaid') NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`status\` varchar(50) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`code\` \`code\` varchar(50) NULL DEFAULT 'NULL'`
        );
    }
}
