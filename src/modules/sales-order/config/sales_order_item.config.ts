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
        isDeleted: {
            name: 'is_deleted',
            type: Boolean,
            nullable: false,
            default: false,
        },
        createdDate: {
            name: 'created_date',
            type: 'date',
            nullable: false,
        },
        createdBy: {
            name: 'created_by',
            type: Number,
            nullable: false,
            default: -1,
        },
        modifiedDate: {
            name: 'modified_date',
            type: 'date',
            nullable: true,
        },
        modifiedBy: {
            name: 'modified_by',
            type: Number,
            nullable: true,
        },
        companyId: {
            name: 'company_id',
            type: Number,
            default: 0,
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
