import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1658803338306 implements MigrationInterface {
    name = 'initDb1658803338306';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`is_deleted\` tinyint NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`created_date\` datetime NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`created_by\` int NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`modified_date\` datetime NOT NULL`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`modified_by\` int NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`company_id\` int NOT NULL DEFAULT '-1'`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`customer_id\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`customer_id\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`company_id\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`modified_by\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`modified_date\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`created_date\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`is_deleted\``);
    }
}
