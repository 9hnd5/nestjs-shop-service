import { SalesOrderProps } from '@modules/sales-order/entities/sales-order.entity';
import { PaymentStatus } from '@modules/sales-order/enums/payment-status.enum';
import { SalesOrderStatus } from '@modules/sales-order/enums/sales-order-status.enum';
import { TenantBaseSchema } from 'be-core';
import { format } from 'date-fns';
import { EntitySchema } from 'typeorm';

export const SalesOrderSchema = new EntitySchema<SalesOrderProps>({
    name: 'SalesOrderProps',
    tableName: 'sales_order',
    target: SalesOrderProps,
    columns: {
        id: {
            name: 'id',
            type: Number,
            primary: true,
            generated: true,
        },
        code: {
            name: 'code',
            nullable: false,
            type: String,
            length: 50,
        },
        status: {
            name: 'status',
            nullable: false,
            type: 'enum',
            enum: SalesOrderStatus,
        },
        salesChannelCode: {
            name: 'sales_channel_code',
            type: String,
            length: 50,
        },
        salesChannelName: {
            name: 'sales_channel_name',
            type: String,
            length: 255,
        },
        postingDate: {
            name: 'posting_date',
            nullable: false,
            type: 'date',
            transformer: {
                from(value: string) {
                    return new Date(value);
                },
                to(value: Date) {
                    return format(value, 'yyyy-MM-dd');
                },
            },
        },
        customerId: {
            name: 'customer_id',
            nullable: true,
            type: Number,
        },
        address: {
            name: 'address',
            nullable: true,
            type: String,
            length: 255,
        },
        contactPerson: {
            name: 'contact_person',
            nullable: false,
            type: String,
            length: 50,
        },
        contactNumber: {
            name: 'contact_number',
            nullable: false,
            type: String,
            length: 11,
        },
        customerName: {
            name: 'customer_name',
            nullable: true,
            type: String,
            length: 50,
        },
        phoneNumber: {
            name: 'phone_number',
            nullable: true,
            type: String,
            length: 11,
        },
        shipAddress: {
            name: 'ship_address',
            nullable: false,
            type: String,
            length: 255,
        },
        deliveryPartner: {
            name: 'delivery_partner',
            nullable: false,
            type: String,
            length: 50,
        },
        deliveryDate: {
            name: 'delivery_date',
            nullable: false,
            type: 'date',
            transformer: {
                from(value: string) {
                    return new Date(value);
                },
                to(value: Date) {
                    return format(value, 'yyyy-MM-dd');
                },
            },
        },
        shippingFee: {
            name: 'shipping_fee',
            nullable: true,
            type: 'double',
            default: 0,
        },
        paymentMethodId: {
            name: 'payment_method_id',
            nullable: false,
            type: Number,
        },
        paymentMethodName: {
            name: 'payment_method_name',
            nullable: false,
            type: String,
            length: 255,
        },
        totalAmount: {
            name: 'total_amount',
            nullable: false,
            type: 'double',
            default: 0,
        },
        orderDiscountAmount: {
            name: 'order_discount_amount',
            nullable: false,
            type: 'double',
            default: 0,
        },
        commission: {
            name: 'commission',
            nullable: false,
            type: 'double',
            default: 0,
        },
        note: {
            name: 'note',
            nullable: true,
            type: String,
            length: 500,
        },
        salesmanCode: {
            name: 'salesman_code',
            nullable: false,
            type: String,
            length: 50,
        },
        salesmanName: {
            name: 'salesman_name',
            nullable: false,
            type: String,
            length: 255,
        },
        paymentStatus: {
            name: 'payment_status',
            nullable: true,
            type: 'enum',
            enum: PaymentStatus,
        },
        ...TenantBaseSchema,
    },
    relations: {
        items: {
            type: 'one-to-many',
            target: 'SalesOrderItemProps',
            cascade: true,
            inverseSide: 'order',
        },
    },
});
