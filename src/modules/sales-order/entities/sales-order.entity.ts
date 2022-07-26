import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { TenantBaseModel } from 'be-core';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sales_order' })
export class SalesOrder extends TenantBaseModel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'name', length: 50 })
    name: string;
    @Column({ name: 'status', length: 50 })
    status: string;
    @Column({ name: 'customer_id' })
    customerId: number;
    @OneToMany(() => SalesOrderItem, (s) => s.order, {
        cascade: true,
    })
    items: SalesOrderItem[];
}
