import { QueryBase } from 'be-core';
import { Exclude, Expose, Type } from 'class-transformer';
import { Allow, IsDate, IsOptional } from 'class-validator';

@Exclude()
export class GetQuery extends QueryBase {
    @Expose()
    @Allow()
    status?: string;

    @Expose()
    @Allow()
    searchText?: string;

    @Expose()
    @Allow()
    salesChannelCode?: string;

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
