import { ProductCategory } from '@modules/shared/models/product-category.model';
import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, CQRSModule, ScopeVariableModule } from 'be-core';
import { AddCommandHandler, DeleteCommandHandler, UpdateCommandHandler } from './commands';
import { ProductCategoryController } from './product-category.controller';

@Module({
    imports: [
        ScopeVariableModule,
        CommonModule,
        SharedModule,
        CQRSModule,
        TypeOrmModule.forFeature([ProductCategory]),
    ],
    controllers: [ProductCategoryController],
    providers: [AddCommandHandler, UpdateCommandHandler, DeleteCommandHandler],
})
export class ProductCategoryModule {}
