import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetSalesInformation {
    @Expose()
    SalesRevenue: number;

    @Expose()
    ActualSalesRevenue: number;

    @Expose()
    SalesVolume: number;

    @Expose()
    ActualSalesVolume: number;

    @Expose()
    OrdersCount: number;

    @Expose()
    OrdersDeliveredCount: number;
}
