import { SalesOrderItemProps } from '@modules/sales-order/entities/sales-order-item.entity';
import { EntitySchema } from 'typeorm';
import { TenantBaseSchema } from 'be-core';

export const SalesOrderItemSchema = new EntitySchema<SalesOrderItemProps>({
    name: 'SalesOrderItemProps',
    tableName: 'sales_order_item',
    target: SalesOrderItemProps,
    columns: {
        id: {
            type: Number,
            generated: true,
            primary: true,
        },
        itemId: {
            name: 'item_id',
            type: Number,
            nullable: false,
        },
        uomId: {
            name: 'uom_id',
            type: Number,
            nullable: false,
        },
        itemType: {
            name: 'item_type',
            type: Number,
            nullable: false,
            default: 0,
        },
        tax: {
            name: 'tax',
            nullable: false,
            type: 'double',
            default: 0,
        },
        unitPrice: {
            name: 'unit_price',
            type: 'double',
            nullable: false,
        },
        quantity: {
            name: 'quantity',
            type: 'double',
            nullable: false,
        },
        percentageDiscount: {
            name: 'percentage_discount',
            nullable: false,
            type: 'double',
            default: 0,
        },
        discountAmount: {
            name: 'discount_amount',
            nullable: false,
            type: 'double',
            default: 0,
        },
        lineTotal: {
            name: 'line_total',
            type: 'double',
            nullable: false,
        },
        ...TenantBaseSchema,
    },
    relations: {
        order: {
            target: 'SalesOrderProps',
            type: 'many-to-one',
            onDelete: 'CASCADE',
            orphanedRowAction: 'delete',
            joinColumn: {
                name: 'order_id',
            },
        },
    },
});
