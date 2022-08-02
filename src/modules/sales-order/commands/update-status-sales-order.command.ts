import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, NotFoundException, RequestHandler } from 'be-core';
import { DataSource, Repository } from 'typeorm';

export class UpdateStatusSalesOrderCommand extends BaseCommand<SalesOrder> {
    id: number;
    status: string;
}

@RequestHandler(UpdateStatusSalesOrderCommand)
export class UpdateStatusSalesOrderCommandHanlder extends BaseCommandHandler<
    UpdateStatusSalesOrderCommand,
    any
> {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        super();
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderSchema);
    }
    async apply(command: UpdateStatusSalesOrderCommand) {
        const { id, status } = command;
        let salesOrder = await this.salesOrderRepo.findOne({
            where: { id },
            relations: {
                items: true,
            },
        });

        if (!salesOrder) {
            throw new NotFoundException('Sales Order not found');
        }

        salesOrder.setStatus(status);
        salesOrder = this.updateBuild(salesOrder, command.session);

        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
