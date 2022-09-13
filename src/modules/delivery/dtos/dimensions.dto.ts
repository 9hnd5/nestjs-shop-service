import { Expose, Type } from 'class-transformer';
import { IsNumber, Min, ValidateNested } from 'class-validator';

export class DimensionsSize {
    constructor(length: number, width: number, height: number) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    @Expose()
    @Min(0)
    @IsNumber()
    length: number; //CM

    @Expose()
    @Min(0)
    @IsNumber()
    width: number; //CM

    @Expose()
    @Min(0)
    @IsNumber()
    height: number; //CM
}

export class Dimensions {
    constructor(weight: number, size: DimensionsSize) {
        this.weight = weight;
        this.size = size;
    }

    @Expose()
    @Min(0)
    @IsNumber()
    weight: number; //KG

    @Expose()
    @ValidateNested()
    @Type(() => DimensionsSize)
    size: DimensionsSize;
}
