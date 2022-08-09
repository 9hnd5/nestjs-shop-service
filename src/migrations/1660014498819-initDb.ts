import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660014498819 implements MigrationInterface {
    name = 'initDb1660014498819';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`payment_status\` enum ('Paid', 'Unpaid') NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`payment_status\``);
    }
}
