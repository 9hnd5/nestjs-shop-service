import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetByIdResponse extends GetResponse {
    @Type(() => SalesOrderItem)
    @Expose()
    items: Item[];
}

@Exclude()
class Item {
    @Expose()
    id: number;

    @Expose()
    itemCode: string;

    @Expose()
    unitPrice: number;

    @Expose()
    quantity: number;
}
