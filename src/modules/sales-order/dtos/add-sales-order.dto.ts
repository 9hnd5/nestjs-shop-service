import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Type } from 'class-transformer';
import { Allow, ArrayNotEmpty, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';

export default class AddSalesOrder {
    @Allow()
    customerId?: number;

    @Allow()
    customerName?: string;

    @Allow()
    phoneNumber?: string;

    @Allow()
    address?: string;

    @IsNotEmpty()
    salesmanCode: number;

    @IsNotEmpty()
    salesmanName: string;

    @IsNotEmpty()
    contactPerson: string;

    @IsNotEmpty()
    contactNumber: string;

    @IsNotEmpty()
    shipAddress: string;

    @IsNotEmpty()
    salesChannelCode: string;

    @IsNotEmpty()
    salesChannelName: string;

    @IsNotEmpty()
    deliveryPartner: string;

    @Type(() => Date)
    @IsDate()
    deliveryDate: Date;

    @IsDate()
    @Type(() => Date)
    postingDate: Date;

    @IsNotEmpty()
    shippingFee: number;

    @IsNotEmpty()
    paymentMethodId: number;

    @IsNotEmpty()
    paymentMethodName: string;

    @Allow()
    commission?: number;

    @Allow()
    note?: string;

    @Allow()
    orderDiscountAmount?: number;

    @Allow()
    isDraft: boolean;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => AddSalesOrderItem)
    items: AddSalesOrderItem[];
}
