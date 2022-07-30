import { QueryModel } from 'be-core';
import { Type } from 'class-transformer';

export class GetQuery extends QueryModel {
    status?: string;
    searchText?: string;
    salesChannel?: string;

    @Type(() => Date)
    fromDate?: Date;

    @Type(() => Date)
    toDate?: Date;
}
