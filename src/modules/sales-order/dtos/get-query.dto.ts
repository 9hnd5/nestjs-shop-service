import { PaymentStatus } from '@modules/sales-order/enums/payment-status.enum';
import { QueryBase } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsBooleanString, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class GetQuery extends QueryBase {
    @Expose()
    @IsString()
    @IsOptional()
    status?: string;

    @Expose()
    @IsBooleanString()
    @IsOptional()
    byLogingUser?: boolean;

    @Expose()
    @IsString()
    @IsOptional()
    searchText?: string;

    @Expose()
    @IsString()
    @IsOptional()
    salesChannelCode?: string;

    @Expose()
    @IsString()
    @IsOptional()
    salesmanCode?: string;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fromDate?: Date;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    toDate?: Date;

    @Expose()
    @IsEnum(PaymentStatus)
    @IsOptional()
    paymentStatus?: string;
}
