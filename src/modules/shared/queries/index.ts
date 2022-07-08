import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ExampleQueries } from './example.queries';
import { PriceListQueries } from './price-list.queries';
import { UomQueries } from './uom.queries';
import { VariantQueries } from './variant.queries';
export default [ExampleQueries, PriceListQueries, UomQueries, VariantQueries];

export class Paging {
    @Transform(({ value }) => +value)
    @IsInt()
    currentPage = 1;

    @Transform(({ value }) => +value)
    @IsInt()
    pageSize = 10;

    searchText?: string;

    @Transform(({ value }) => +value)
    @IsInt()
    viewMode = 1;
}
