import AddSalesOrderItem from '@modules/sales-order/dtos/add-sales-order-item.dto';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export default class UpdateSalesOrderItem extends AddSalesOrderItem {
    @Expose()
    @IsInt()
    @IsPositive()
    @IsOptional()
    id?: number;
}
