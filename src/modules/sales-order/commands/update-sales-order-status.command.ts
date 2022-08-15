import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

export class UpdateSalesOrderStatusCommand extends BaseCommand<SalesOrder> {
    id: number;
    status: SalesOrderStatus;
}

@RequestHandler(UpdateSalesOrderStatusCommand)
export class UpdateSalesOrderStatusCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderStatusCommand,
    any
> {
    constructor(private salesOrderRepo: SalesOrderRepo) {
        super();
    }
    async apply(command: UpdateSalesOrderStatusCommand) {
        const { id, status } = command;
        const salesOrder = await this.salesOrderRepo.repository.findOne({
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
                salesOrder.changeStatusToNew(status, 0);
                break;
            case SalesOrderStatus.Confirmed:
                salesOrder.changeStatusToConfirmed(status, 0);
                break;
            case SalesOrderStatus.Canceled:
                salesOrder.changeStatusToCanceled(status, 0);
                break;
            case SalesOrderStatus.OrderPreparation:
                salesOrder.changeStatusToOrderPreparation(status, 0);
                break;
            case SalesOrderStatus.WaitingDelivery:
                salesOrder.changeStatusToWaitingDelivery(status, 0);
                break;
            case SalesOrderStatus.Delivered:
                salesOrder.changeStatusToDeliveried(status, 0);
                break;
            case SalesOrderStatus.Returned:
                salesOrder.changeStatusToReturned(status, 0);
                break;
            default:
                break;
        }
        const result = await this.salesOrderRepo.repository.save(salesOrder);
        return result.entity.id;
    }
}
