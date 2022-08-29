import { Expose, Type } from 'class-transformer';

class From {
    @Expose()
    fromCountryCode: string;

    @Expose()
    fromProvinceCode: string;

    @Expose()
    fromDistrictCode: string;

    @Expose()
    fromWardCode: string;

    @Expose()
    fromStreet: string;

    @Expose()
    fromPhoneNumber?: string;

    @Expose()
    fromFullName?: string;

    @Expose()
    fromPostCode?: string;

    @Expose()
    fromEmail?: string;
}

class To {
    @Expose()
    toCountryCode: string;

    @Expose()
    toProvinceCode: string;

    @Expose()
    toDistrictCode: string;

    @Expose()
    toWardCode: string;

    @Expose()
    toStreet: string;

    @Expose()
    toPhoneNumber?: string;

    @Expose()
    toFullName?: string;

    @Expose()
    toPostCode?: string;

    @Expose()
    toEmail?: string;
}

class Size {
    @Expose()
    length: number;

    @Expose()
    width: number;

    @Expose()
    height: number;
}

class Dimension {
    @Expose()
    weight: number;

    @Expose()
    @Type(() => Size)
    size: Size;
}

export class GetDocumentByCodeResponse {
    @Expose()
    _id: string;

    @Expose()
    code: string;

    @Expose()
    partnerCode: string;

    @Expose()
    userId: string;

    @Expose()
    @Type(() => From)
    from: From;

    @Expose()
    @Type(() => To)
    to: To;

    @Expose()
    @Type(() => Dimension)
    dimension: Dimension;

    @Expose()
    fromNote: string;

    @Expose()
    toNote: string;

    @Expose()
    isPickup: boolean;

    @Expose()
    insuranceAmount: number;

    @Expose()
    insuranceFee: number;

    @Expose()
    isCOD: boolean;

    @Expose()
    codAmount: number;

    @Expose()
    paymentType: string;

    @Expose()
    isActive: boolean;

    @Expose()
    allowTrial: boolean;

    @Expose()
    serviceLevel: boolean;

    @Expose()
    itemType: boolean;

    @Expose()
    deliveryFee: boolean;

    @Expose()
    totalFee: boolean;

    @Expose()
    email: boolean;

    @Expose()
    lines: boolean;
}
