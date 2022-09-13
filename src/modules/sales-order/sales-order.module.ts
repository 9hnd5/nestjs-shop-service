import { DeliveryService } from '@modules/delivery/delivery.service';
import { AddSalesOrderCommandHandler } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderPostingDateHandler } from '@modules/sales-order/commands/update-sales-order-posting-date.command';
import { UpdateSalesOrderCommandHanlder } from '@modules/sales-order/commands/update-sales-order.command';
import { SalesOrderController } from '@modules/sales-order/sales-order.controller';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { SalesOrderService } from '@modules/sales-order/sales-order.service';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';
import { CalculateSalesOrderCommandHandler } from './commands/calculate_order.command';
import { UpdateSalesOrderStatusCommandHanlder } from './commands/update-sales-order-status.command';

@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [
        AddSalesOrderCommandHandler,
        UpdateSalesOrderCommandHanlder,
        UpdateSalesOrderStatusCommandHanlder,
        UpdateSalesOrderPostingDateHandler,
        CalculateSalesOrderCommandHandler,
        SalesOrderQuery,
        SalesOrderService,
        SalesOrderRepo,
        DeliveryService,
    ],
    controllers: [SalesOrderController],
})
export class SalesOrderModule {}
