import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeModel } from './models/attribute.model';
import { BrandModel } from './models/brand.model';
import QueriesList from './queries';
import RepositoriesList from './repositories';
import { ExampleModel } from './models/example.model';
import { Uom } from './models/uom.model';
import { CommonModule } from 'be-core';
import { PriceListModel } from './models/price-list.model';
import { Variant } from './models/variant.model';
import { ProductCategory } from './models/product-category.model';

@Module({
    imports: [
        CommonModule,
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
