import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { DeliveryLocation } from '../interface/delivery_location';
import { Dimensions } from '../interface/dimensions';
import { DocumentLine } from '../interface/document-line.interface';

export class GetDocumentsQuery {
    @Expose()
    @IsString()
    code: string;

    @Expose()
    @IsString()
    status: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    partnerCode: string;

    @Expose()
    @IsString()
    userId: string;

    @Expose()
    @IsNotEmpty()
    from: DeliveryLocation;

    @Expose()
    @IsNotEmpty()
    to: DeliveryLocation;

    @Expose()
    @IsString()
    dimension: Dimensions;

    @Expose()
    @IsString()
    fromNote: string;

    @Expose()
    @IsString()
    toNote: string;

    @Expose()
    isPickup: boolean;

    @Expose()
    @IsString()
    insuranceAmount: number;

    @Expose()
    @IsString()
    insuranceFee: number;

    @Expose()
    isCOD: boolean;

    @Expose()
    codAmount: number;

    @Expose()
    allowTrial: boolean;

    @Expose()
    @IsString()
    paymentType: string;

    @Expose()
    isActive: boolean;

    @Expose()
    @IsString()
    serviceLevel: string;

    @Expose()
    @IsString()
    itemType: string;

    @Expose()
    deliveryFee: number;

    @Expose()
    totalFee: number;

    @Expose()
    @IsString()
    email: string;

    @Expose()
    lines: DocumentLine;

    @Expose()
    @IsString()
    webhook: string;

    @Expose()
    totalFeeUpdated: number;
}
