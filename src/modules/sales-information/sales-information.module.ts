import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';
import { SalesInformationController } from './sales-information.controller';
import { SalesInformationQuery } from './sales-information.query';
import { SalesInformationService } from './sales-information.service';
import SalesOrderRepo from './sales-order.repo';
@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [SalesInformationQuery, SalesInformationService, SalesOrderRepo],
    controllers: [SalesInformationController],
})
export class SalesInformationModule {}
