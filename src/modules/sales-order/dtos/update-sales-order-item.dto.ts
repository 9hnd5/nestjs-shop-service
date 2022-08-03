import { AddSalesOrderItemDto } from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Allow } from 'class-validator';

export class UpdateSalesOrderItemDto extends AddSalesOrderItemDto {
    @Allow()
    id?: number;
}
