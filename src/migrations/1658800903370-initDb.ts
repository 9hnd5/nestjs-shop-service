import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1658800903370 implements MigrationInterface {
    name = 'initDb1658800903370';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`sales_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`status\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`sales_order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`item_code\` varchar(50) NOT NULL, \`unit_price\` float NOT NULL, \`quantity\` float NOT NULL, \`order_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` ADD CONSTRAINT \`FK_4759a2cc727c8989652f479c642\` FOREIGN KEY (\`order_id\`) REFERENCES \`sales_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
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
