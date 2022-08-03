import { AddSalesOrderCommand } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderCommand } from '@modules/sales-order/commands/update-sales-order.command';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Mediator } from 'be-core';
import { UpdateStatusSalesOrderCommand } from './commands/update-status-sales-order.command';
import { SalesOrderStatus } from './enums/sales-order-status.enum';

@Controller('sales-order')
export class SalesOrderController {
    constructor(private mediator: Mediator, private salesOrderQuery: SalesOrderQuery) {}
    @Get()
    get(@Query() query: GetQuery) {
        return this.salesOrderQuery.get(query);
    }

    @Get('/summary')
    analyze() {
        return this.salesOrderQuery.getStatusSummary();
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.salesOrderQuery.getById(id);
    }

    @Post()
    post(@Body() command: AddSalesOrderCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    put(@Param('id') id: number, @Body() command: UpdateSalesOrderCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Put(':id/new')
    updateStatusToNew(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.New;
        return this.mediator.send(command);
    }

    @Put(':id/confirmed')
    updateStatusConfirmed(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.Confirmed;
        return this.mediator.send(command);
    }

    @Put(':id/order-preparation')
    updateStatusToOrderPreparation(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.OrderPreparation;
        return this.mediator.send(command);
    }

    @Put(':id/waiting-delivery')
    updateStatusToWaitingDelivery(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.WaitingDelivery;
        return this.mediator.send(command);
    }

    @Put(':id/delivered')
    updateStatusToDelivered(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.Delivered;
        return this.mediator.send(command);
    }

    @Put(':id/canceled')
    updateStatusToCanceled(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.Canceled;
        return this.mediator.send(command);
    }

    @Put(':id/returned')
    updateStatusToReturned(@Param('id') id: number) {
        const command = new UpdateStatusSalesOrderCommand();
        command.id = id;
        command.status = SalesOrderStatus.Returned;
        return this.mediator.send(command);
    }
}
