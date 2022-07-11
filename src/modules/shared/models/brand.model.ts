import { TenantBaseModel } from 'be-core';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('brand')
export class BrandModel extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'brand_name', length: 50 })
    public brandName: string;

    @Column({ length: 50 })
    public description: string;

    @Column({ length: 20 })
    public status: string;
}
