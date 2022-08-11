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

        const result = await this.salesOrderRepo.repository.save(salesOrder);
        return result.entity.id;
    }
}
