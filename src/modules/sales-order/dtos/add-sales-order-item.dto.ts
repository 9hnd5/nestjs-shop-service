import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export default class AddSalesOrderItem {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    itemId: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    uomId: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;

    @Expose()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    tax?: number;
}
