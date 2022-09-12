import { QueryBase } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetQuery extends QueryBase {
    @Expose()
    @IsString()
    @IsNotEmpty()
    salesmanCodes: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    itemIds: string;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fromDate: Date;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    toDate: Date;
}
