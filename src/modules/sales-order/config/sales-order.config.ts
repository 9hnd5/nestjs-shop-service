import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { EntitySchema } from 'typeorm';

export const SalesOrderSchema = new EntitySchema<SalesOrder>({
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
        code: {
            name: 'code',
            nullable: true,
            type: String,
            length: 50,
        },
        status: {
            name: 'status',
            type: String,
            length: 50,
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
            type: Date,
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
            length: 50,
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
            type: Date,
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
        tax: {
            name: 'tax',
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
        items: {
            type: 'one-to-many',
            target: 'SalesOrderItem',
            cascade: true,
            inverseSide: 'order',
        },
    },
});
