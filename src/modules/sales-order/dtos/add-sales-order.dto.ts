import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Expose, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export default class AddSalesOrder {
    @Expose()
    @IsNumber()
    @IsOptional()
    customerId?: number;

    @Expose()
    @IsString()
    @IsOptional()
    customerName?: string;

    @Expose()
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @Expose()
    @IsString()
    @IsOptional()
    address?: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    salesmanCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    salesmanName: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    contactPerson: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    contactNumber: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    shipAddress: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    salesChannelCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    salesChannelName: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    deliveryPartner: string;

    @Expose()
    @Type(() => Date)
    @IsDate()
    deliveryDate: Date;

    @Expose()
    @IsDate()
    @Type(() => Date)
    postingDate: Date;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    shippingFee: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    paymentMethodId: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    paymentMethodName: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    commission?: number;

    @Expose()
    @IsString()
    @IsOptional()
    note?: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    orderDiscountAmount?: number;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isDraft?: boolean;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => AddSalesOrderItem)
    items: AddSalesOrderItem[];
}
