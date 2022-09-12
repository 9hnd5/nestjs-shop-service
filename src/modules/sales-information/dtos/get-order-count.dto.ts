import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetOrderCount {
    @Expose()
    ordersCount: number;

    @Expose()
    ordersDeliveredCount: number;
}
