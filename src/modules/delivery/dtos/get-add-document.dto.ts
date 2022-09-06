import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, IsNumber, IsEmail, IsUrl } from 'class-validator';
import { DeliveryLocation } from '../interface/delivery_location';
import { Dimensions } from '../interface/dimensions';
import { DocumentLine } from '../interface/document-line.interface';

export class GetAddDocument {
    @Expose()
    @IsString()
    code: string;

    @Expose()
    @IsString()
    status: string;

    @Expose()
    @IsString()
    partnerDocumentCode: string;

    @Expose()
    @IsString()
    partnerCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @Expose()
    @IsNotEmpty()
    from: DeliveryLocation;

    @Expose()
    @IsNotEmpty()
    to: DeliveryLocation;

    @Expose()
    @IsNotEmpty()
    dimension: Dimensions;

    @Expose()
    @IsString()
    fromNote: string;

    @Expose()
    @IsString()
    toNote: string;

    @Expose()
    @IsBoolean()
    isPickup: boolean;

    @Expose()
    @IsNumber()
    insuranceAmount: number;

    @Expose()
    @IsNumber()
    insuranceFee: number;

    @Expose()
    @IsNumber()
    isCOD: number;

    @Expose()
    @IsNumber()
    codAmount: number;

    @Expose()
    @IsString()
    paymentType: string;

    @Expose()
    @IsUrl()
    webhook: string;

    @Expose()
    @IsBoolean()
    allowTrial: boolean;

    @Expose()
    @IsNotEmpty()
    serviceLevel: string;

    @Expose()
    @IsNotEmpty()
    itemType: string;

    @Expose()
    @IsNumber()
    deliveryFee: number;

    @Expose()
    @IsNumber()
    totalFee: number;

    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    lines: DocumentLine[];

    @Expose()
    @IsNumber()
    totalFeeUpdated: number;
}
