import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetByIdResponse extends GetResponse {
    @Expose()
    paymentMethod?: string;

    @Expose()
    @Type(() => Item)
    items: Item[];
}

@Exclude()
class Item {
    @Expose()
    id: number;

    @Expose()
    itemId: string;

    @Expose()
    uomId: string;

    @Expose()
    unitPrice: number;

    @Expose()
    quantity: number;

    @Expose()
    lineTotal: number;
}
