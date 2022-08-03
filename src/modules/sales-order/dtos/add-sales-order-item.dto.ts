import { Allow, IsNotEmpty } from 'class-validator';

export class AddSalesOrderItemDto {
    @IsNotEmpty()
    itemId: number;

    @IsNotEmpty()
    uomId: number;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    quantity: number;

    @Allow()
    tax?: number;
}
