import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1660559778056 implements MigrationInterface {
    name = 'initDb1660559778056';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`contact_address_id\` int NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`contact_address_id\``);
    }
}
