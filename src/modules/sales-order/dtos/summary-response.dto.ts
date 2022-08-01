import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CountStatus {
    @Expose()
    status: string;

    @Expose()
    @Transform(({ value }) => +value)
    count: number;
}

@Exclude()
export class SummaryResponse {
    @Expose()
    total: number;

    @Expose()
    countStatus: CountStatus[];
}
