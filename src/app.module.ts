import { DeliveryModule } from '@modules/delivery/delivery.module';
import { MigrationModule } from '@modules/internals/migration/migration.module';
import { SalesOrderModule } from '@modules/sales-order/sales-order.module';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, REQUEST } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AuthModule,
    CacheModule,
    CloseConnectionInterceptor,
    CoreResInterceptor,
    InitialModule,
} from 'be-core';
import { load } from './config';
import { SalesInformationModule } from './modules/sales-information/sales-information.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [load],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (request: any) => {
                return !request.scopeVariable.tenantCode
                    ? {
                          type: 'mysql',
                          host: request.scopeVariable.primary.host,
                          port: request.scopeVariable.primary.port,
                          username: request.scopeVariable.primary.username,
                          password: request.scopeVariable.primary.password,
                      }
                    : {
                          type: 'mysql',
                          host: request.scopeVariable.primary.host,
                          port: request.scopeVariable.primary.port,
                          username: request.scopeVariable.primary.username,
                          password: request.scopeVariable.primary.password,
                          database: request.scopeVariable.primary.database,
                          entities: [__dirname + '/modules/**/**.entity.{ts,js}'],
                          synchronize: false,
                          retryAttempts: 3,
                          retryDelay: 1000,
                          entitySkipConstructor: true,
                      };
            },
            inject: [REQUEST],
        }),
        SalesOrderModule,
        SalesInformationModule,
        DeliveryModule,
        CacheModule,
        InitialModule,
        AuthModule,
        MigrationModule,
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
