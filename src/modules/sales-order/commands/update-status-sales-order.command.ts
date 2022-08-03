import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

export class UpdateStatusSalesOrderCommand extends BaseCommand<SalesOrder> {
    id: number;
    status: SalesOrderStatus;
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

        switch (status) {
            case SalesOrderStatus.New:
                salesOrder.changeStatusToNew(status);
                break;
            case SalesOrderStatus.Confirmed:
                salesOrder.changeStatusToConfirmed(status);
                break;
            case SalesOrderStatus.Canceled:
                salesOrder.changeStatusToCanceled(status);
                break;
            case SalesOrderStatus.OrderPreparation:
                salesOrder.changeStatusToOrderPreparation(status);
                break;
            case SalesOrderStatus.WaitingDelivery:
                salesOrder.changeStatusToWaitingDelivery(status);
                break;
            case SalesOrderStatus.Delivered:
                salesOrder.changeStatusToDeliveried(status);
                break;
            case SalesOrderStatus.Returned:
                salesOrder.changeStatusToReturned(status);
                break;
            default:
                break;
        }

        salesOrder = this.updateBuild(salesOrder, command.session);

        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
