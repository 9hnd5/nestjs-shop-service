import { QueryModel } from 'be-core';
import { Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { subDays } from 'date-fns';
export class GetQuery extends QueryModel {
    @Allow()
    status?: string;
    @Allow()
    searchText?: string;
    @Allow()
    salesChannel?: string;

    @Type(() => Date)
    @Allow()
    fromDate: Date = subDays(new Date(), 7);

    @Type(() => Date)
    @Allow()
    toDate: Date = new Date();
}
