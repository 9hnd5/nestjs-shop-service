import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetByIdResponse extends GetResponse {
    @Expose()
    note?: string;

    @Expose()
    orderDiscountAmount: number;

    @Expose()
    totalBeforeDiscount: number;

    @Expose()
    totalLineDiscount: number;

    @Expose()
    @Type(() => Item)
    items: Item[];
}

@Exclude()
class Item {
    @Expose()
    id: number;

    @Expose()
    itemId: number;

    @Expose()
    itemName: string;

    @Expose()
    uomId: number;

    @Expose()
    uomName: string;

    @Expose()
    unitPrice: number;

    @Expose()
    quantity: number;

    @Expose()
    lineTotal: number;

    @Expose()
    imageId: string;

    @Expose()
    @Type(() => PriceListDetail)
    priceListDetails: PriceListDetail[];
}

class PriceListDetail {
    @Expose()
    uomId: number;

    @Expose()
    uomName: string;

    @Expose()
    price?: number;

    @Expose()
    maxPrice?: number;

    @Expose()
    promotionPrice?: number;

    @Expose()
    commissionPercent: number;
}
