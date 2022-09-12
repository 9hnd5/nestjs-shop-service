import { Exclude, Expose } from 'class-transformer';
import { Double } from 'typeorm';

@Exclude()
export class GetRevenue {
    @Expose()
    SalesRevenue: Double;

    @Expose()
    ActualSalesRevenue: Double;
}
