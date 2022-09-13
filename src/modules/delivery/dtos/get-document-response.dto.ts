import { Expose, Type } from 'class-transformer';

class From {
    @Expose()
    countryCode: string;

    @Expose()
    provinceCode: string;

    @Expose()
    districtCode: string;

    @Expose()
    wardCode: string;

    @Expose()
    street: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    fullName?: string;

    @Expose()
    postCode?: string;

    @Expose()
    email?: string;
}

class To {
    @Expose()
    countryCode: string;

    @Expose()
    provinceCode: string;

    @Expose()
    districtCode: string;

    @Expose()
    wardCode: string;

    @Expose()
    street: string;

    @Expose()
    phoneNumber?: string;

    @Expose()
    fullName?: string;

    @Expose()
    postCode?: string;

    @Expose()
    email?: string;
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

class DocumentLine {
    @Expose()
    name: string;

    @Expose()
    code: string;

    @Expose()
    quantity: number;

    @Expose()
    weight: number;
}

export class GetDocumentResponse {
    @Expose()
    _id: string;

    @Expose()
    code: string;

    @Expose()
    status: string;

    @Expose()
    partnerDocumentCode: string;

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
    allowTrial: boolean;

    @Expose()
    serviceLevel: string;

    @Expose()
    itemType: string;

    @Expose()
    deliveryFee: number;

    @Expose()
    totalFee: number;

    @Expose()
    email: string;

    @Expose()
    lines: DocumentLine[];
}
