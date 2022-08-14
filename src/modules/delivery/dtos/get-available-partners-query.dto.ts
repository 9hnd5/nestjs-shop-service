import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class DeliveryLocationQuery {
    @Expose()
    @IsString()
    countryCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    provinceCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    districtCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    wardCode: string;

    @Expose()
    @IsString()
    street: string;

    @Expose()
    @IsOptional()
    phoneNumber: string;

    @Expose()
    @IsOptional()
    fullName: string;

    @Expose()
    @IsOptional()
    postCode?: string | null;

    @Expose()
    @IsOptional()
    email?: string | null;
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
