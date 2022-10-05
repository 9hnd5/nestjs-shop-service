import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetOrderdData {
    @Expose()
    OrderId: number;

    @Expose()
    SalesmanCode: string;

    @Expose()
    Status: string;

    @Expose()
    ItemId: number;

    @Expose()
    UomId: number;

    @Expose()
    Quantity: number;

    @Expose()
    LineTotal: number;

    @Expose()
    TotalBeforeDiscount: number;
}
