import { AttributeRepository } from './attribute.repository';
import { BrandRepository } from './brand.repository';
import { ExampleRepository } from './example.repository';
import { PriceListRepository } from './price-list.repository';
import { ProductCategoryRepository } from './product-category.repository';
import { UomRepository } from './uom.repository';
import { VariantRepository } from './variant.repository';

export default [
    ExampleRepository,
    PriceListRepository,
    UomRepository,
    VariantRepository,
    BrandRepository,
    ProductCategoryRepository,
    AttributeRepository,
];
