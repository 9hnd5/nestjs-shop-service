import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { load } from './config';
import { ExampleModule } from '@modules/example';
import { PriceListModule } from '@modules/price-list';
import { UomModule } from '@modules/uom';
import { REQUEST } from '@nestjs/core';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CachingModule, CommonModule, HealthModule } from 'be-core';
console.log(__dirname + '/modules/shared/models/*{.ts,.js}')
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [load],
      isGlobal: true
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
          entities: [
            __dirname + '/modules/shared/models/*{.ts,.js}'
          ], 
          synchronize: false,
          retryAttempts: 3,
          retryDelay: 1000
        } 
      },
      inject: [REQUEST]
    }),
    CommonModule,
    HealthModule,
    CachingModule,
    ExampleModule,
    PriceListModule,
    UomModule
  ]
})
export class AppModule {}
