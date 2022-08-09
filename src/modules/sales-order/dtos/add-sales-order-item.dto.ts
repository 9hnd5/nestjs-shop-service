import { Allow, IsNotEmpty } from 'class-validator';

export default class AddSalesOrderItem {
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
