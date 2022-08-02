import { AddSalesOrderCommandHandler } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderCommandHanlder } from '@modules/sales-order/commands/update-sales-order.command';
import { SalesOrderController } from '@modules/sales-order/sales-order.controller';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';
import { UpdateStatusSalesOrderCommandHanlder } from './commands/update-status-sales-order.command';

@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [
        AddSalesOrderCommandHandler,
        UpdateSalesOrderCommandHanlder,
        UpdateStatusSalesOrderCommandHanlder,
        SalesOrderQuery,
    ],
    controllers: [SalesOrderController],
})
export class SalesOrderModule {}
