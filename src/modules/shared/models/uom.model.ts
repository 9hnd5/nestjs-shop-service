import { TenantBaseModel } from 'be-core';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Uom extends TenantBaseModel {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ nullable: false, length: 50 })
    public code: string;

    @Column({ length: 50 })
    public name: string;

    @Column({ length: 255 })
    public description: string;

    @Column({ nullable: false })
    public status: boolean;
}
