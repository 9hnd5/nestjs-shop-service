import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1662695716480 implements MigrationInterface {
    name = 'initial1662695716480';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`sales_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`delivery_date\` datetime NOT NULL, \`status\` varchar(255) NOT NULL, \`posting_date\` datetime NOT NULL, \`contact_person\` varchar(255) NOT NULL, \`contact_phone_number\` varchar(255) NOT NULL, \`contact_address\` varchar(255) NOT NULL, \`contact_address_id\` int NOT NULL, \`sales_channel_code\` varchar(255) NOT NULL, \`sales_channel_name\` varchar(255) NOT NULL, \`delivery_partner\` varchar(255) NOT NULL, \`shipping_fee\` int NOT NULL, \`payment_method_id\` int NOT NULL, \`payment_method_name\` varchar(255) NOT NULL, \`total_amount\` int NOT NULL, \`total_before_discount\` int NOT NULL, \`total_line_discount\` int NOT NULL, \`order_discount_amount\` int NOT NULL, \`commission\` int NOT NULL, \`salesman_code\` varchar(255) NOT NULL, \`salesman_name\` varchar(255) NOT NULL, \`tax\` int NOT NULL, \`payment_status\` enum ('Paid', 'Unpaid') NULL, \`customer_id\` int NULL, \`customer_name\` varchar(255) NULL, \`customer_phone_number\` varchar(255) NULL, \`customer_address\` varchar(255) NULL, \`note\` varchar(255) NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_date\` datetime NOT NULL, \`created_by\` int NOT NULL, \`modified_date\` datetime NULL, \`modified_by\` int NULL, \`company_id\` int NOT NULL DEFAULT '-1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`sales_order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`item_id\` int NOT NULL, \`uom_id\` int NOT NULL, \`tax\` int NOT NULL, \`percentage_discount\` int NOT NULL DEFAULT '0', \`discount_amount\` int NOT NULL, \`unit_price\` int NOT NULL, \`quantity\` int NOT NULL, \`line_total\` int NOT NULL, \`item_type\` int NOT NULL, \`weight\` double NOT NULL DEFAULT '0', \`length\` double NOT NULL DEFAULT '0', \`width\` double NOT NULL DEFAULT '0', \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_date\` datetime NOT NULL, \`created_by\` int NOT NULL, \`modified_date\` datetime NULL, \`modified_by\` int NULL, \`company_id\` int NOT NULL DEFAULT '-1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD CONSTRAINT \`FK_4759a2cc727c8989652f479c642\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` DROP FOREIGN KEY \`FK_4759a2cc727c8989652f479c642\``
        );
        await queryRunner.query(`DROP TABLE \`sales_order_item\``);
        await queryRunner.query(`DROP TABLE \`sales_order\``);
    }
}
