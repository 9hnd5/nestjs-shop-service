import { Exclude, Expose, Transform } from 'class-transformer';

export class OrderStatus {
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
    paymentStatuses: PaymentStatus[];

    @Expose()
    orderStatuses: OrderStatus[];

    @Expose()
    totalCount: number;
}
