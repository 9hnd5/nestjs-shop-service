import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import UpdateSalesOrderItem from '@modules/sales-order/dtos/update-sales-order-item.dto';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsDate, IsOptional, ValidateNested } from 'class-validator';

export default class UpdateSalesOrder extends OmitType(AddSalesOrder, [
    'postingDate',
    'items',
    'isDraft',
] as const) {
    id: number;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    postingDate?: Date;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => UpdateSalesOrderItem)
    items: UpdateSalesOrderItem[];
}
