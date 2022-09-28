import { Expose } from 'class-transformer';
import { QueryBase } from 'be-core';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetPartnerPricesQuery extends QueryBase {
    @Expose()
    @IsNotEmpty()
    @IsString()
    fromProvinceCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    fromDistrictCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    toProvinceCode: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    toDistrictCode: string;

    @Expose()
    @IsOptional()
    @IsString()
    search?: string;
}
