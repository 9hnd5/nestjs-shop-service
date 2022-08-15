import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660486971153 implements MigrationInterface {
    name = 'initDb1660486971153';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`created_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`created_date\` datetime NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`modified_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`modified_date\` datetime NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`created_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`created_date\` datetime NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`modified_date\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`modified_date\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`modified_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`modified_date\` date NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`created_date\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`created_date\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`modified_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`modified_date\` date NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`created_date\``);
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD \`created_date\` date NOT NULL`
        );
    }
}
