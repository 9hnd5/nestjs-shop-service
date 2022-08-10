import { QueryBase } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

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
    @IsString()
    @IsOptional()
    salesmanCode?: string;

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
