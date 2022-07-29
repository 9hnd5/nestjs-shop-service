import { AddSalesOrderCommand } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderCommand } from '@modules/sales-order/commands/update-sales-order.command';
import { SummaryQuery } from '@modules/sales-order/dtos/summary-query.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Mediator } from 'be-core';

@Controller('sales-order')
export class SalesOrderController {
    constructor(private mediator: Mediator, private salesOrderQuery: SalesOrderQuery) {}
    @Get()
    get(@Query() query: GetQuery) {
        return this.salesOrderQuery.get(query);
    }

    @Get('/summary')
    analyze(@Query() query: SummaryQuery) {
        return this.salesOrderQuery.getSummary(query);
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
}
