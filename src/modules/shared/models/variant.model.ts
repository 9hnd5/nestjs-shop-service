import { TenantBaseModel } from 'be-core';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Variant extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ length: 50 })
    public code: string;

    @Column({ name: 'variant_name', length: 50 })
    public variantName: string;

    @Column({ length: 255 })
    public description: string;

    @Column({ nullable: false })
    public status: boolean;
}
