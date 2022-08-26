import { FeatureConst } from '@constants/feature.const';
import { MessageConst } from '@constants/message.const';
import { AddSalesOrderCommand } from '@modules/sales-order/commands/add-sales-order.command';
import { UpdateSalesOrderPostingDateCommand } from '@modules/sales-order/commands/update-sales-order-posting-date.command';
import { UpdateSalesOrderCommand } from '@modules/sales-order/commands/update-sales-order.command';
import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import SummaryQuery from '@modules/sales-order/dtos/summary-query.dto';
import UpdateSalesOrder from '@modules/sales-order/dtos/update-sales-order.dto';
import { SalesOrderQuery } from '@modules/sales-order/sales-order.query';
import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { BaseController, LocalAuthorize, Mediator, Permission } from 'be-core';
import { CalculateSalesOrderCommand } from './commands/calculate_order.command';
import { UpdateSalesOrderStatusCommand } from './commands/update-sales-order-status.command';
import { SalesOrderStatus } from './enums/sales-order-status.enum';
import { SalesOrderService } from './sales-order.service';

@Controller('sales-order')
export class SalesOrderController extends BaseController {
    constructor(
        private mediator: Mediator,
        private salesOrderQuery: SalesOrderQuery,
        private salesOrderService: SalesOrderService
    ) {
        super();
    }

    @Get()
    @LocalAuthorize(FeatureConst.orderManagement, Permission.View)
    async get(@Query() query: GetQuery) {
        if (query.byLogingUser) {
            const userId = this.scopeVariable.session?.userId ?? 0;
            const response = await this.salesOrderService.getEmployeeByUserId(+userId);
            if (!response) {
                throw new NotFoundException(MessageConst.EmployeeNotExist);
            }
            query.salesmanCode = response.code;
        }
        return this.salesOrderQuery.get(query);
    }

    @Get('/by-salesman')
    @LocalAuthorize(FeatureConst.orderManagement, Permission.View)
    async getsBySalesman(@Query() query: GetQuery) {
        const userId = this.scopeVariable.session?.userId ?? 0;
        const response = await this.salesOrderService.getEmployeeByUserId(+userId);
        if (response) {
            query.salesmanCode = response.code;
            return this.salesOrderQuery.get(query);
        }
        throw new NotFoundException(MessageConst.EmployeeNotExist);
    }

    @Get('/summary')
    analyze(@Query() query: SummaryQuery) {
        return this.salesOrderQuery.getStatusSummary(query);
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.salesOrderQuery.getById(id);
    }

    @Post()
    post(@Body() data: AddSalesOrder) {
        const command = new AddSalesOrderCommand();
        command.data = data;
        return this.mediator.send(command);
    }

    @Post('/calculate')
    calculateOrder(@Body() data: AddSalesOrder) {
        const command = new CalculateSalesOrderCommand();
        command.data = data;
        return this.mediator.send(command);
    }

    @Put(':id')
    put(@Param('id') id: number, @Body() data: UpdateSalesOrder) {
        data.id = id;
        const command = new UpdateSalesOrderCommand();
        command.data = data;
        return this.mediator.send(command);
    }

    @Put(':id/new')
    updateStatusToNew(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.New;
        return this.mediator.send(command);
    }

    @Put(':id/confirmed')
    updateStatusConfirmed(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.Confirmed;
        return this.mediator.send(command);
    }

    @Put(':id/order-preparation')
    updateStatusToOrderPreparation(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.OrderPreparation;
        return this.mediator.send(command);
    }

    @Put(':id/waiting-delivery')
    updateStatusToWaitingDelivery(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.WaitingDelivery;
        return this.mediator.send(command);
    }

    @Put(':id/delivered')
    updateStatusToDelivered(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.Delivered;
        return this.mediator.send(command);
    }

    @Put(':id/canceled')
    updateStatusToCanceled(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.Canceled;
        return this.mediator.send(command);
    }

    @Put(':id/returned')
    updateStatusToReturned(@Param('id') id: number) {
        const command = new UpdateSalesOrderStatusCommand();
        command.id = id;
        command.status = SalesOrderStatus.Returned;
        return this.mediator.send(command);
    }

    @Patch(':id')
    updatePostingDate(@Param('id') id: number, @Body() data: UpdateSalesOrderPostingDateCommand) {
        data.id = id;
        return this.mediator.send(data);
    }
}
