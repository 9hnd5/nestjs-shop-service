import { MessageConst } from '@constants/.';
import { DeliveryService } from '@modules/delivery/delivery.service';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';
import { SalesOrderService } from '../sales-order.service';

export class UpdateSalesOrderStatusCommand extends BaseCommand<SalesOrder> {
    id: number;
    status: SalesOrderStatus;
}

@RequestHandler(UpdateSalesOrderStatusCommand)
export class UpdateSalesOrderStatusCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderStatusCommand,
    any
> {
    private queryRunner: QueryRunner;
    constructor(
        dataSource: DataSource,
        private deliveryService: DeliveryService,
        private salesOrderService: SalesOrderService,
        private salesOrderRepo: SalesOrderRepo
    ) {
        super();
        this.queryRunner = dataSource.createQueryRunner();
    }
    async apply(command: UpdateSalesOrderStatusCommand) {
        const { id, status } = command;
        try {
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            const repo = this.salesOrderRepo.withManager(this.queryRunner.manager);
            const salesOrder = await repo.findOneEntity({
                where: { id },
            });

            if (!salesOrder) {
                throw new NotFoundException(MessageConst.SalesOrderNotExist);
            }

            switch (status) {
                case SalesOrderStatus.New:
                    {
                        salesOrder.changeStatusToNew(status);
                        const deliveryAddress = await this.salesOrderService.getAddressById(
                            salesOrder.contactAddressId
                        );
                        if (!deliveryAddress) {
                            throw new BusinessException(MessageConst.AddressNotExist);
                        }
                        const responseDocument = await this.deliveryService.addDocument(
                            salesOrder,
                            deliveryAddress,
                            deliveryAddress
                        );

                        salesOrder.paymentType = responseDocument.paymentType;
                        salesOrder.serviceLevel = responseDocument.serviceLevel;
                        salesOrder.itemType = responseDocument.itemType;
                        salesOrder.shippingFee = responseDocument.deliveryFee;
                        salesOrder.deliveryOrderCode = responseDocument.code;
                        await repo.saveEntity(salesOrder);
                    }
                    break;
                case SalesOrderStatus.Confirmed:
                    {
                        salesOrder.changeStatusToConfirmed(status);
                        await repo.saveEntity(salesOrder);
                        if (salesOrder.deliveryOrderCode) {
                            await this.deliveryService.confirmedDocument(
                                salesOrder.deliveryOrderCode
                            );
                        }
                    }
                    break;
                case SalesOrderStatus.Canceled:
                    {
                        salesOrder.changeStatusToCanceled(status);
                        await repo.saveEntity(salesOrder);
                        if (salesOrder.deliveryOrderCode) {
                            await this.deliveryService.cancelDocument(salesOrder.deliveryOrderCode);
                        }
                    }
                    break;
                case SalesOrderStatus.OrderPreparation:
                    salesOrder.changeStatusToOrderPreparation(status);
                    await repo.saveEntity(salesOrder);
                    break;
                case SalesOrderStatus.WaitingDelivery:
                    salesOrder.changeStatusToWaitingDelivery(status);
                    await repo.saveEntity(salesOrder);
                    break;
                case SalesOrderStatus.Delivered:
                    salesOrder.changeStatusToDeliveried(status);
                    await repo.saveEntity(salesOrder);
                    break;
                case SalesOrderStatus.Returned:
                    salesOrder.changeStatusToReturned(status);
                    await repo.saveEntity(salesOrder);
                    break;
                default:
                    break;
            }
            await this.queryRunner.commitTransaction();
            return salesOrder.id;
        } catch (error) {
            this.queryRunner.rollbackTransaction();
            throw error;
        }
    }
}
