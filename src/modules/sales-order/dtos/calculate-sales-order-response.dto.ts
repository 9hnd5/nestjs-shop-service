import { SalesOrderItemEntity } from '../entities/sales-order-item.entity';
import { SalesOrderEntity } from '../entities/sales-order.entity';

export class CalculateSalesOrderResponse extends SalesOrderEntity {
    items: CalculateSalesOrderItemResponse[];
    beforeInsert: () => void;
    beforeUpdate: () => void;
}

class CalculateSalesOrderItemResponse extends SalesOrderItemEntity {
    uomCode?: string;
    uomName?: string;
    itemImageId?: string;
    beforeInsert: () => void;
    beforeUpdate: () => void;
}
