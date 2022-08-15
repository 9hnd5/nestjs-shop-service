import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export default class AddSalesOrderItem {
    @Expose()
    @IsPositive()
    @IsInt()
    itemId: number;

    @Expose()
    @IsPositive()
    @IsInt()
    uomId: number;

    @Expose()
    @Min(0)
    @IsNumber()
    unitPrice: number;

    @Expose()
    @Min(0)
    @IsNumber()
    quantity: number;

    @Expose()
    @Min(0)
    @IsNumber()
    @IsOptional()
    tax?: number;
}
