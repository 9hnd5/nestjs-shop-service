import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetListPartnerQuery {
    @Expose()
    @IsString()
    fromCountryCode: string;

    @Expose()
    @IsString()
    fromProvinceCode: string;

    @Expose()
    @IsString()
    fromDistrictCode: string;

    @Expose()
    @IsString()
    fromWardCode: string;

    @Expose()
    @IsString()
    fromStreet: string;

    @Expose()
    @IsOptional()
    @IsString()
    fromPhoneNumber?: string;

    @Expose()
    @IsOptional()
    @IsString()
    fromFullName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    fromPostCode?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    fromEmail?: string;

    @Expose()
    @IsString()
    toCountryCode: string;

    @Expose()
    @IsString()
    toProvinceCode: string;

    @Expose()
    @IsString()
    toDistrictCode: string;

    @Expose()
    @IsString()
    toWardCode: string;

    @Expose()
    @IsString()
    toStreet: string;

    @Expose()
    @IsOptional()
    @IsString()
    toPhoneNumber?: string;

    @Expose()
    @IsOptional()
    @IsString()
    toFullName?: string;

    @Expose()
    @IsOptional()
    @IsString()
    toPostCode?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    toEmail?: string;
}
