import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Expose, Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsBoolean,
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

export default class AddSalesOrder {
    @Expose()
    @IsPositive()
    @IsInt()
    @IsOptional()
    customerId?: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    customerName?: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    customerPhoneNumber?: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    customerAddress?: string;

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
    contactPhoneNumber: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    contactAddress: string;

    @Expose()
    @IsPositive()
    @IsInt()
    contactAddressId: number;

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
    @Min(0)
    @IsNumber()
    shippingFee: number;

    @Expose()
    @IsPositive()
    @IsInt()
    paymentMethodId: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    paymentMethodName: string;

    @Expose()
    @Min(0)
    @IsNumber()
    @IsOptional()
    commission?: number;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    note?: string;

    @Expose()
    @Min(0)
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
