import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPromoName1667289973514 implements MigrationInterface {
    name = 'addPromoName1667289973514';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`promotion_description\` \`promotion_name\` varchar(100) NULL DEFAULT 'NULL'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order_item\` CHANGE \`promotion_name\` \`promotion_description\` varchar(1000) NULL DEFAULT 'NULL'`
        );
    }
}
