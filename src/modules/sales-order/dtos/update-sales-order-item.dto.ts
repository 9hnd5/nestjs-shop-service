import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { IsNumber, IsOptional } from 'class-validator';

export default class UpdateSalesOrderItem extends AddSalesOrderItem {
    @IsNumber()
    @IsOptional()
    id?: number;
}
