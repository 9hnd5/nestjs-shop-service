import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';

export class UpdateSalesOrderPostingDateCommand extends BaseCommand<SalesOrder> {
    id: number;
    postingDate: Date;
}

@RequestHandler(UpdateSalesOrderPostingDateCommand)
export class UpdateSalesOrderPostingDateHandler extends BaseCommandHandler<
    UpdateSalesOrderPostingDateCommand,
    any
> {
    constructor(private salesOrderRepo: SalesOrderRepo) {
        super();
    }
    async apply(command: UpdateSalesOrderPostingDateCommand): Promise<any> {
        const { id, postingDate } = command;
        const salesOrder = await this.salesOrderRepo.repository.findOne({ where: { id } });
        if (!salesOrder) throw new NotFoundException('Sales Order not found');
        salesOrder.changePostingDate(postingDate);
        this.salesOrderRepo.repository.save(salesOrder);
    }
}
