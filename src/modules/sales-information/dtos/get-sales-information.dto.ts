import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetSalesInformation {
    @Expose()
    SalesRevenue: number;

    @Expose()
    ActualSalesRevenue: number;

    @Expose()
    SalesVolumn: number;

    @Expose()
    ActualSalesVolumn: number;
}
