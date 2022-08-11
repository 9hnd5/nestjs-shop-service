import { Exclude, Expose, Transform } from 'class-transformer';

export class CountStatus {
    @Expose()
    status: string;

    @Expose()
    @Transform(({ value }) => +value)
    count: number;
}

export class PaymentStatus {
    count: number;
    status: string;
}

@Exclude()
export class SummaryResponse {
    @Expose()
    total: number;

    @Expose()
    paymentStatus: PaymentStatus[];

    @Expose()
    countStatus: CountStatus[];
}
