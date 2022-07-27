import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1658892698226 implements MigrationInterface {
    name = 'initDb1658892698226';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`sales_order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`item_code\` varchar(50) NOT NULL, \`unit_price\` float NOT NULL, \`quantity\` float NOT NULL, \`total_price\` float NOT NULL, \`order_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`sales_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`status\` varchar(50) NOT NULL, \`customer_id\` int NOT NULL, \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`created_date\` date NOT NULL, \`created_by\` int NOT NULL DEFAULT '-1', \`modified_date\` date NULL, \`modified_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
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
