import { Type } from 'class-transformer';
import { Allow } from 'class-validator';

export class SummaryQuery {
    @Allow()
    @Type(() => Date)
    fromDate?: Date;

    @Allow()
    @Type(() => Date)
    toDate?: Date;
}
