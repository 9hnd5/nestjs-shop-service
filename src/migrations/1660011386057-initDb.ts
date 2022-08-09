import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660011386057 implements MigrationInterface {
    name = 'initDb1660011386057';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` ADD \`salesman_code\` int NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`salesman_name\` varchar(255) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`salesman_name\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`salesman_code\``);
    }
}
