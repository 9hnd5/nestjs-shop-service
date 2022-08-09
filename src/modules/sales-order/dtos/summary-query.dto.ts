import { Exclude, Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export default class SummaryQuery {
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
