import { MigrationInterface, QueryRunner } from 'typeorm';

export class longerAddress1659499171160 implements MigrationInterface {
    name = 'longerAddress1659499171160';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`sales_order\` CHANGE \`address\` \`address\` varchar(50) NULL DEFAULT NULL`
        );
    }
}
