import { AddSalesOrderCommandHandler } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderCommandHanlder } from '@modules/sales-order/commands/update-sales-order.command';
import { SalesOrderController } from '@modules/sales-order/sales-order.controller';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import { Module } from '@nestjs/common';
import { CQRSModule } from 'be-core';

@Module({
    imports: [CQRSModule],
    providers: [AddSalesOrderCommandHandler, UpdateSalesOrderCommandHanlder, SalesOrderQuery],
    controllers: [SalesOrderController],
})
export class SalesOrderModule {}
