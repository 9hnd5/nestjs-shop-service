import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class DeliveryLocationQuery {
    @Expose()
    @IsString()
    countryCode: string;

    @Expose()
    @IsString()
    provinceCode: string;

    @Expose()
    @IsString()
    districtCode: string;

    @Expose()
    @IsString()
    wardCode: string;

    @Expose()
    @IsString()
    street: string;

    @Expose()
    @IsOptional()
    phoneNumber?: string;

    @Expose()
    @IsOptional()
    fullName?: string;

    @Expose()
    @IsOptional()
    postCode?: string;

    @Expose()
    @IsOptional()
    email?: string;
}

export class GetAvailablePartnersQuery {
    @Expose()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DeliveryLocationQuery)
    from: DeliveryLocationQuery;

    @Expose()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DeliveryLocationQuery)
    to: DeliveryLocationQuery;
}
