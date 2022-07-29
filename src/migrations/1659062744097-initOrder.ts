import { MigrationInterface, QueryRunner } from 'typeorm';

export class initOrder1659062744097 implements MigrationInterface {
    name = 'initOrder1659062744097';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`sales_order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`item_id\` int NOT NULL, \`uom_id\` int NOT NULL, \`item_type\` int NOT NULL DEFAULT '0', \`tax\` double NOT NULL DEFAULT '0', \`unit_price\` double NOT NULL, \`quantity\` double NOT NULL, \`percentage_discount\` double NOT NULL DEFAULT '0', \`discount_amount\` double NOT NULL DEFAULT '0', \`line_total\` double NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_date\` date NOT NULL, \`created_by\` int NOT NULL DEFAULT '-1', \`modified_date\` date NULL, \`modified_by\` int NULL, \`company_id\` int NOT NULL DEFAULT '0', \`order_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`sales_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(50) NULL, \`status\` varchar(50) NOT NULL, \`sales_channel\` varchar(50) NOT NULL, \`posting_date\` datetime NOT NULL, \`customer_id\` int NULL, \`address\` varchar(50) NOT NULL, \`contact_person\` varchar(50) NOT NULL, \`contact_number\` varchar(11) NOT NULL, \`customer_name\` varchar(50) NOT NULL, \`phone_number\` varchar(11) NOT NULL, \`ship_address\` varchar(255) NOT NULL, \`delivery_partner\` varchar(50) NOT NULL, \`delivery_date\` datetime NOT NULL, \`shipping_fee\` double NULL DEFAULT '0', \`payment_method_id\` int NOT NULL, \`total_amount\` double NOT NULL DEFAULT '0', \`discount_amount\` double NOT NULL DEFAULT '0', \`commission\` double NOT NULL DEFAULT '0', \`tax\` double NOT NULL DEFAULT '0', \`note\` varchar(500) NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_date\` date NOT NULL, \`created_by\` int NOT NULL DEFAULT '-1', \`modified_date\` date NULL, \`modified_by\` int NULL, \`company_id\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD CONSTRAINT \`FK_4759a2cc727c8989652f479c642\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` DROP FOREIGN KEY \`FK_4759a2cc727c8989652f479c642\``
        );
        await queryRunner.query(`DROP TABLE \`sales_order\``);
        await queryRunner.query(`DROP TABLE \`sales_order_item\``);
    }
}
