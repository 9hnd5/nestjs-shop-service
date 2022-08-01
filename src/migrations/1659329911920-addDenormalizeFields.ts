import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDenormalizeFields1659329911920 implements MigrationInterface {
    name = 'addDenormalizeFields1659329911920';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`sales_channel_name\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` ADD \`payment_method_name\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` DROP FOREIGN KEY \`FK_4759a2cc727c8989652f479c642\``
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`modified_date\` \`modified_date\` date NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`modified_by\` \`modified_by\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`order_id\` \`order_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`code\` \`code\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`customer_id\` \`customer_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`note\` \`note\` varchar(500) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`modified_date\` \`modified_date\` date NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`modified_by\` \`modified_by\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD CONSTRAINT \`FK_4759a2cc727c8989652f479c642\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` DROP FOREIGN KEY \`FK_4759a2cc727c8989652f479c642\``
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`modified_by\` \`modified_by\` int NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`modified_date\` \`modified_date\` date NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`note\` \`note\` varchar(500) NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`customer_id\` \`customer_id\` int NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`code\` \`code\` varchar(50) NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`order_id\` \`order_id\` int NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`modified_by\` \`modified_by\` int NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`modified_date\` \`modified_date\` date NULL DEFAULT 'NULL'`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD CONSTRAINT \`FK_4759a2cc727c8989652f479c642\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`payment_method_name\``);
        await queryRunner.query(`ALTER TABLE \`sales_order\` DROP COLUMN \`sales_channel_name\``);
    }
}
