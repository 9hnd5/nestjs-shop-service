import { Expose, Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsEmail,
    IsUrl,
    ValidateNested,
    IsEnum,
    Min,
} from 'class-validator';
import { ItemType } from '../enums/item-type.enum';
import { PaymentType } from '../enums/payment-type.enum';
import { ServiceLevel } from '../enums/service-level.enum';
import { DeliveryLocation } from './delivery-location.dto';
import { Dimensions } from './dimensions.dto';

export class AddDocument {
    @Expose()
    @IsString()
    partnerCode: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DeliveryLocation)
    from: DeliveryLocation;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DeliveryLocation)
    to: DeliveryLocation;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Dimensions)
    dimension: Dimensions;

    @Expose()
    @IsNumber()
    insuranceAmount: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @IsEnum(PaymentType)
    paymentType: string;

    @Expose()
    @IsUrl()
    webhook: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEnum(ServiceLevel)
    serviceLevel: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsEnum(ItemType)
    itemType: string;

    @Expose()
    @IsEmail()
    email: string;

    @ValidateNested()
    @Type(() => DocumentLine)
    lines: DocumentLine[];
}

export class DocumentLine {
    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsString()
    code: string;

    @Expose()
    @Min(0)
    @IsNumber()
    quantity: number;

    @Expose()
    @Min(0)
    @IsNumber()
    weight: number;
}
