import { Type } from 'class-transformer';

export class SummaryQuery {
    @Type(() => Date)
    fromDate?: Date = new Date('1945-01-01');
    @Type(() => Date)
    toDate?: Date = new Date('2222-01-01');
}
