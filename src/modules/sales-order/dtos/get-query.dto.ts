import { QueryModel } from 'be-core';
import { Type } from 'class-transformer';
import { Allow, IsDate } from 'class-validator';
import { subDays } from 'date-fns';
export class GetQuery extends QueryModel {
    @Allow()
    status?: string;
    @Allow()
    searchText?: string;
    @Allow()
    salesChannelCode?: string;

    @Type(() => Date)
    @IsDate()
    fromDate: Date = subDays(new Date(), 7);

    @Type(() => Date)
    @IsDate()
    toDate: Date = new Date();
}
