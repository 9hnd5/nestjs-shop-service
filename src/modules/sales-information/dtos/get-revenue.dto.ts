import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetRevenue {
    @Expose()
    SalesRevenue: number;

    @Expose()
    ActualSalesRevenue: number;
}
