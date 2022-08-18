import { DeliveryModule } from '@modules/delivery/delivery.module';
import { SalesOrderModule } from '@modules/sales-order/sales-order.module';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AuthModule,
    CacheModule,
    CoreResInterceptor,
    InitialModule,
    CloseConnectionInterceptor,
} from 'be-core';
import { DataSource } from 'typeorm';
import { load } from './config';
const dataSource = new DataSource({
    type: 'mysql',
    host: '172.16.0.110',
    port: 6003,
    username: 'dev',
    password: 'comatic_dev@2022',
    database: 'comatic_icc',
    entities: [__dirname + '/modules/**/**.config.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    synchronize: false,
});
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
                    entities: [__dirname + '/modules/**/**.config.{ts,js}'],
                    synchronize: false,
                    retryAttempts: 3,
                    retryDelay: 1000,
                    entitySkipConstructor: true,
                };
            },
            inject: [REQUEST],
        }),
        SalesOrderModule,
        DeliveryModule,
        CacheModule,
        InitialModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CoreResInterceptor,
            scope: Scope.REQUEST,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CloseConnectionInterceptor,
            scope: Scope.REQUEST,
        },
    ],
})
export class AppModule {}
export { dataSource };
