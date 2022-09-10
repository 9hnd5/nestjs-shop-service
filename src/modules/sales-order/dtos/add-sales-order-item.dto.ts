import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export default class AddSalesOrderItem {
    @Expose()
    @Min(0)
    @IsInt()
    itemId: number;

    @Expose()
    @Min(0)
    @IsInt()
    uomId: number;

    @Expose()
    @IsPositive()
    @IsInt()
    itemType: number;

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
