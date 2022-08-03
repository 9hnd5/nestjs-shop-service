import { AddSalesOrderDto } from '@modules/sales-order/dtos/add-sales-order.dto';
import { UpdateSalesOrderItemDto } from '@modules/sales-order/dtos/update-sales-order-item.dto';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { Allow, ArrayNotEmpty, ValidateNested } from 'class-validator';

export class UpdateSalesOrderDto extends OmitType(AddSalesOrderDto, [
    'postingDate',
    'items',
    'isDraft',
] as const) {
    id: number;

    @Allow()
    code?: string;

    @Type(() => Date)
    @Allow()
    postingDate?: Date;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => UpdateSalesOrderItemDto)
    items: UpdateSalesOrderItemDto[];
}
