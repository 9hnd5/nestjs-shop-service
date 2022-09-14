import { QueryBase } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class GetBySalesMans extends QueryBase {
    @Expose()
    @IsString()
    @IsNotEmpty()
    salesmanCodes: string;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    fromDate: Date;

    @Expose()
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    toDate: Date;
}
