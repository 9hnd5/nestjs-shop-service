import { Expose, Type } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    ValidateNested,
} from 'class-validator';

export class DeliveryLocationDetail {
    @Expose()
    @IsString()
    @IsNotEmpty()
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
    @IsNotEmpty()
    street: string;

    @Expose()
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string;

    @Expose()
    @IsOptional()
    @IsString()
    fullName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    postCode?: string;

    @Expose()
    @IsOptional()
    @IsString()
    email?: string;
}

export class GetAvailablePartnersQuery {
    @Expose()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DeliveryLocationDetail)
    from: DeliveryLocationDetail;

    @Expose()
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => DeliveryLocationDetail)
    to: DeliveryLocationDetail;
}

export class DeliveryLocationQuery {
    @Expose()
    @IsString()
    @IsNotEmpty()
    fromCountryCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    fromProvinceCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    fromDistrictCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    fromWardCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    fromStreet: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fromPhoneNumber?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fromFullName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    fromPostCode?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    fromEmail?: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    toCountryCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    toProvinceCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    toDistrictCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    toWardCode: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    toStreet: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    toPhoneNumber?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    toFullName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    toPostCode?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    toEmail?: string;
}
