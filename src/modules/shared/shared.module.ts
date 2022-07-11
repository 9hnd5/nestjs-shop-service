import { BrandModel } from './models/brand.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import QueriesList from './queries';
import RepositoriesList from './repositories';
import { ExampleModel } from './models/example.model';
import { Uom } from './models/uom.model';
import { CommonModule, ScopeVariableModule } from 'be-core';
import { PriceListModel } from './models/price-list.model';
import { Variant } from './models/variant.model';

@Module({
    imports: [
        ScopeVariableModule,
        CommonModule,
        TypeOrmModule.forFeature([ExampleModel, PriceListModel, Uom, Variant, BrandModel]),
    ],
    providers: [...QueriesList, ...RepositoriesList],
    exports: [...QueriesList, ...RepositoriesList],
})
export class SharedModule {}
