import { Exclude, Expose, Type } from 'class-transformer';
import { Allow, IsDate, IsOptional } from 'class-validator';

@Exclude()
export default class SummaryQuery {
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

    @Expose()
    @Allow()
    salesmanCode?: string;
}
