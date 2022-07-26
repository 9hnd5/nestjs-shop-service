import { Type } from 'class-transformer';

export class SummaryQuery {
    @Type(() => Date)
    fromDate?: Date;
    @Type(() => Date)
    toDate?: Date;
}
