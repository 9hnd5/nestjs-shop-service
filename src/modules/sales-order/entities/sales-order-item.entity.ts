import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sales_order_item' })
export class SalesOrderItem {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'item_code', length: 50 })
    itemCode: string;
    @Column({ name: 'unit_price', type: 'float' })
    unitPrice: number;
    @Column({ name: 'quantity', type: 'float' })
    quantity: number;
    @Column({ name: 'total_price', type: 'float' })
    totalPrice: number;
    @ManyToOne(() => SalesOrder, (order) => order.items, {
        onDelete: 'CASCADE',
        nullable: false,
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'order_id' })
    order: SalesOrder;
}
