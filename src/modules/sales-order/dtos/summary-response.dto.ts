import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class SummaryResponse {
    @Expose()
    @Transform(({ value }) => +value)
    count: number;

    @Expose()
    status: string;
}
