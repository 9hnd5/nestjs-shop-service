import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class DeliveryLocation {
    constructor(
        street: string,
        wardCode: string,
        districtCode: string,
        provinceCode: string,
        countryCode: string,
        fullName: string,
        phoneNumber: string,
        postCode?: string,
        email?: string
    ) {
        this.street = street;
        this.wardCode = wardCode;
        this.districtCode = districtCode;
        this.provinceCode = provinceCode;
        this.countryCode = countryCode;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.postCode = postCode;
        this.email = email;
    }

    @Expose()
    @IsNotEmpty()
    @IsString()
    countryCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    provinceCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    districtCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    wardCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    street: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    postCode?: string;

    @Expose()
    @IsEmail()
    @IsOptional()
    email?: string;
}
