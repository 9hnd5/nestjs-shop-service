import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { EntitySchema } from 'typeorm';

export const SalesOrderItemEntity = new EntitySchema<SalesOrderItem>({
    name: 'SalesOrderItem',
    tableName: 'sales_order_item',
    target: SalesOrderItem,
    columns: {
        id: {
            type: Number,
            generated: true,
            primary: true,
        },
        itemCode: {
            name: 'item_code',
            type: String,
            length: 50,
        },
        unitPrice: {
            name: 'unit_price',
            type: 'float',
        },
        quantity: {
            name: 'quantity',
            type: 'float',
        },
        totalPrice: {
            name: 'total_price',
            type: 'float',
        },
    },
    relations: {
        order: {
            target: 'SalesOrder',
            type: 'many-to-one',
            onDelete: 'CASCADE',
            orphanedRowAction: 'delete',
            joinColumn: {
                name: 'order_id',
            },
        },
    },
});
