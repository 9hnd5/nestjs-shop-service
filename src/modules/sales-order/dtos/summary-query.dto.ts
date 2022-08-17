import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

@Exclude()
export default class SummaryQuery {
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

    @Expose()
    @IsString()
    @IsOptional()
    orderStatus?: string;
}
