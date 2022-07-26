import { Transform } from 'class-transformer';

export class SummaryResponse {
    status: string;
    @Transform(({ value }) => +value)
    count: number;
}
