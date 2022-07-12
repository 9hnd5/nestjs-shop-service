import { TenantBaseModel } from 'be-core';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('attribute')
export class AttributeModel extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'attribute_code', length: 50 })
    public attributeCode: string;

    @Column({ name: 'attribute_name', length: 50 })
    public attributeName: string;

    @Column({ length: 50 })
    public description: string;

    @Column({ length: 20 })
    public status: string;
}
