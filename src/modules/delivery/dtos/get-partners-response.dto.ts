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
}

export class GetPartnersResponse {
    @Expose()
    _id: string;

    @Expose()
    userId: string;

    @Expose()
    code: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    @Type(() => PartnerInformation)
    partnerInformation: PartnerInformation;

    @Expose()
    isActive: boolean;

    @Expose()
    logoUrl: string;

    @Expose()
    isLive: boolean;
}
