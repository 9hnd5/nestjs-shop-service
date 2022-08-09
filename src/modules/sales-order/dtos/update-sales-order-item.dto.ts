import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Allow } from 'class-validator';

export default class UpdateSalesOrderItem extends AddSalesOrderItem {
    @Allow()
    id?: number;
}
