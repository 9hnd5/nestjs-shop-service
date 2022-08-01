import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class SummaryQuery {
    @Type(() => Date)
    @IsDate()
    fromDate?: Date = new Date('1945-01-01');

    @Type(() => Date)
    @IsDate()
    toDate?: Date = new Date('2222-01-01')
}
