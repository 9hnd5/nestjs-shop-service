import { TenantBaseModel } from 'be-core';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProductCategory extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_code', length: 50 })
    public productCode: string;

    @Column({ name: 'product_group', length: 50 })
    public productGroup: string;

    @Column({ length: 50 })
    public description: string;

    @Column({ nullable: false })
    public status: boolean;
}
