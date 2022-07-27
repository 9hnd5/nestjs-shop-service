import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { EntitySchema } from 'typeorm';

export const SalesOrderEntity = new EntitySchema<SalesOrder>({
    name: 'SalesOrder',
    tableName: 'sales_order',
    target: SalesOrder,
    columns: {
        id: {
            name: 'id',
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            name: 'name',
            type: String,
            length: 50,
        },
        status: {
            name: 'status',
            type: String,
            length: 50,
        },
        customerId: {
            name: 'customer_id',
            nullable: true,
            type: Number,
        },
        customerName: {
            name: 'customer_name',
            nullable: true,
            type: String,
        },
        deliveryCode: {
            name: 'delivery_code',
            nullable: true,
            type: String,
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
    },
    relations: {
        items: {
            type: 'one-to-many',
            target: 'SalesOrderItem',
            cascade: true,
            inverseSide: 'order',
        },
    },
});
