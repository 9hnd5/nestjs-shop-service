import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModel } from './models/attribute.model';
import { BrandModel } from './models/brand.model';
import { ExampleModel } from './models/example.model';
import { PriceListModel } from './models/price-list.model';
import { ProductCategory } from './models/product-category.model';
import { Uom } from './models/uom.model';
import { Variant } from './models/variant.model';
import QueriesList from './queries';
import RepositoriesList from './repositories';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ExampleModel,
            PriceListModel,
            Uom,
            Variant,
            ProductCategory,
            BrandModel,
            AttributeModel,
        ]),
    ],
    providers: [...QueriesList, ...RepositoriesList],
    exports: [...QueriesList, ...RepositoriesList],
})
export class SharedModule {}
