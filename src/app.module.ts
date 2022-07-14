import { AttributeModule } from './modules/attribute/attribute.module';
import { ExampleModule } from '@modules/example';
import { PriceListModule } from '@modules/price-list';
import { UomModule } from '@modules/uom';
import { VariantModule } from '@modules/variant';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {InitialModule, AuthModule, CacheModule}from "be-core";
import { load } from './config';
import { BrandModule } from './modules/brand/brand.module';
import { ProductCategoryModule } from '@modules/product-category';
console.log(__dirname + '/modules/shared/models/*{.ts,.js}');
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [load],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (request: any) => {
                return {
                    type: 'mysql',
                    host: request.scopeVariable.primary.host,
                    port: request.scopeVariable.primary.port,
                    username: request.scopeVariable.primary.username,
                    password: request.scopeVariable.primary.password,
                    database: request.scopeVariable.primary.database,
                    entities: [__dirname + '/modules/shared/models/*{.ts,.js}'],
                    synchronize: false,
                    retryAttempts: 3,
                    retryDelay: 1000,
                };
            },
            inject: [REQUEST],
        }),
        CacheModule,
        InitialModule,
        AuthModule,
        ExampleModule,
        PriceListModule,
        UomModule,
        VariantModule,
        BrandModule,
        ProductCategoryModule,
        AttributeModule,
    ],
})
export class AppModule {}
