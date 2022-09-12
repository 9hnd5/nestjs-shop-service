import { Exclude, Expose } from 'class-transformer';
import { Double } from 'typeorm';

@Exclude()
export class GetSalesInformation {
    @Expose()
    SalesRevenue: Double;

    @Expose()
    ActualSalesRevenue: Double;

    @Expose()
    SalesVolumn: Double;

    @Expose()
    ActualSalesVolumn: Double;
}
