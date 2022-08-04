import { AddSalesOrderCommandHandler } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderCommandHanlder } from '@modules/sales-order/commands/update-sales-order.command';
import { SalesOrderController } from '@modules/sales-order/sales-order.controller';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import { SalesOrderService } from '@modules/sales-order/sales-order.service';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';
import { UpdateSalesOrderStatusCommandHanlder } from './commands/update-sales-order-status.command';

@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [
        AddSalesOrderCommandHandler,
        UpdateSalesOrderCommandHanlder,
        UpdateSalesOrderStatusCommandHanlder,
        SalesOrderQuery,
        SalesOrderService,
    ],
    controllers: [SalesOrderController],
})
export class SalesOrderModule {}
