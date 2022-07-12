import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';
import { AttributeQueries } from './attribute.queries';
import { BrandQueries } from './brand.queries';
import { ExampleQueries } from './example.queries';
import { PriceListQueries } from './price-list.queries';
import { ProductCategoryQueries } from './product-category.queries';
import { UomQueries } from './uom.queries';
import { VariantQueries } from './variant.queries';
export default [
    ExampleQueries,
    PriceListQueries,
    UomQueries,
    VariantQueries,
    ProductCategoryQueries,
    BrandQueries,
    AttributeQueries,
];

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
