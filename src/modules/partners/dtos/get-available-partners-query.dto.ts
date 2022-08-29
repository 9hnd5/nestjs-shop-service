import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAvailablePartnersQuery {
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
