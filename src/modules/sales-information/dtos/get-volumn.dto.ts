import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetVolume {
    @Expose()
    orderId: number;

    @Expose()
    itemId: number;

    @Expose()
    uomId: number;

    @Expose()
    uomName: string;

    @Expose()
    quantity: number;
}
