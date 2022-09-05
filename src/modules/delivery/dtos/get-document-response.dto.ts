import { Expose, Type } from 'class-transformer';

class FormField {
    @Expose()
    label: string;

    @Expose()
    value?: string | number;

    @Expose()
    fieldName: string;
}

class PartnerInformation {
    @Expose()
    @Type(() => FormField)
    host?: FormField;

    @Expose()
    @Type(() => FormField)
    countryCode?: FormField;

    @Expose()
    @Type(() => FormField)
    version?: FormField;

    @Expose()
    @Type(() => FormField)
    protocol?: FormField;

    @Expose()
    @Type(() => FormField)
    accessToken?: FormField;

    @Expose()
    @Type(() => FormField)
    isUseStore?: FormField;

    @Expose()
    @Type(() => FormField)
    isUsePriceList?: FormField;

    @Expose()
    @Type(() => FormField)
    clientId?: FormField;

    @Expose()
    @Type(() => FormField)
    clientSecret?: FormField;

    @Expose()
    @Type(() => FormField)
    tokenExpiresTime?: FormField;
}
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
    isCOD: number;

    @Expose()
    codAmount: number;

    @Expose()
    paymentType: 'SENDER' | 'RECEIVER';

    @Expose()
    allowTrial: boolean;

    @Expose()
    serviceLevel: 'STANDARD' | 'EXPRESS' | 'SAMEDAY' | 'NEXTDAY';

    @Expose()
    itemType: 'NORMAL' | 'FRAGILITY';

    @Expose()
    deliveryFee: number;

    @Expose()
    totalFee: number;

    @Expose()
    email: string;

    @Expose()
    lines: DocumentLine[];

    @Expose()
    webhook: string;

    @Expose()
    totalFeeUpdated: number; // tổng phí do đối tác response
}