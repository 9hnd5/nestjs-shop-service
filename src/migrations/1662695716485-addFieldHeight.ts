import { MigrationInterface, QueryRunner } from "typeorm";

export class addFieldHeight1662695716485 implements MigrationInterface {
    name = 'addFieldHeight1662695716485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` ADD \`height\` int NOT NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`sales_order_item\` DROP COLUMN \`height\``);
       
    }

}
