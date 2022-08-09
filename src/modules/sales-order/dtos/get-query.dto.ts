import { QueryBase } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetQuery extends QueryBase {
    @Expose()
    @IsString()
    @IsOptional()
    status?: string;

    @Expose()
    @IsString()
    @IsOptional()
    searchText?: string;

    @Expose()
    @IsString()
    @IsOptional()
    salesChannelCode?: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    salesmanCode?: number;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fromDate?: Date;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    toDate?: Date;
}
