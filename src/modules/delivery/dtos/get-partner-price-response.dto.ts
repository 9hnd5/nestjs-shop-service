import { Expose } from 'class-transformer';

export class GetPartnerPriceResponse {
    @Expose()
    _id: string;

    @Expose()
    partnerCode: string;

    @Expose()
    fromProvinceCode: string;

    @Expose()
    toProvinceCode: string;

    @Expose()
    toDistrictCode: string;

    @Expose()
    fromDistrictCode: string;

    @Expose()
    deliveryFee: number;

    @Expose()
    price: number;

    @Expose()
    description: string | null;
}
