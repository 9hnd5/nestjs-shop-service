import { SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { AddType, AggregateRoot, TenantEntity } from 'be-core';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales_order_item')
export class SalesOrderItemEntity extends TenantEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'order_id', type: Number })
    orderId: number;
    @Column({ name: 'item_id', type: Number })
    itemId: number;
    @Column({ name: 'uom_id', type: Number })
    uomId: number;
    @Column({ name: 'tax', type: Number })
    tax: number;
    @Column({ name: 'percentage_discount', type: Number })
    percentageDiscount: number;
    @Column({ name: 'discount_amount', type: Number })
    discountAmount: number;
    @Column({ name: 'unit_price', type: Number })
    unitPrice: number;
    @Column({ name: 'quantity', type: Number })
    quantity: number;
    @Column({ name: 'line_total', type: Number })
    lineTotal: number;
    @ManyToOne(() => SalesOrderEntity, (s) => s.items, { orphanedRowAction: 'delete' })
    @JoinColumn({ name: 'order_id' })
    order: SalesOrderEntity;
    @Column({ name: 'item_type', type: Number })
    itemType: number;
}
type AddProps = Pick<
    AddType<SalesOrderItemEntity>,
    'itemId' | 'uomId' | 'unitPrice' | 'quantity' | 'tax' | 'itemType'
>;

type UpdateProps = Omit<AddProps, 'tax'>;
export class SalesOrderItem extends AggregateRoot<SalesOrderItemEntity> {
    constructor(entity: Partial<SalesOrderItemEntity>) {
        super(entity);
    }

    get itemId() {
        return this.entity.itemId;
    }
    set itemId(value: number) {
        this.entity.itemId = value;
    }
    set uomId(value: number) {
        this.entity.uomId = value;
    }

    update(data: UpdateProps) {
        this.entity.itemId = data.itemId;
        this.entity.uomId = data.uomId;
        this.entity.quantity = data.quantity;
        this.entity.unitPrice = data.unitPrice;
        this.entity.lineTotal = data.quantity * data.unitPrice;
    }

    static create(data: AddProps) {
        return new SalesOrderItem({
            ...data,
            discountAmount: 0,
            lineTotal: data.quantity * data.unitPrice,
        });
    }

    static createDiscountLine(data: AddProps, discountAmount: number) {
        return new SalesOrderItem({
            ...data,
            discountAmount,
            lineTotal: -discountAmount,
        });
    }

    static createFromPersistence(entity: SalesOrderItemEntity) {
        return new SalesOrderItem(entity);
    }
}
