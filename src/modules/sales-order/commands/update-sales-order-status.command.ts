import { MessageConst } from '@constants/message.const';
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
        private salesOrderRepo: SalesOrderRepo,
        private deliveryService: DeliveryService,
        private salesOrderService: SalesOrderService
    ) {
        super();
        this.queryRunner = dataSource.createQueryRunner();
    }
    async apply(command: UpdateSalesOrderStatusCommand) {
        const { id, status } = command;
        try {
            this.queryRunner.connect();
            this.queryRunner.startTransaction();
            const repo = this.queryRunner.manager.withRepository(this.salesOrderRepo.repository);
            const salesOrder = await repo.findOne({
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
                        await repo.save(salesOrder);
                    }
                    break;
                case SalesOrderStatus.Confirmed:
                    {
                        salesOrder.changeStatusToConfirmed(status);
                        await repo.save(salesOrder);
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
                        await repo.save(salesOrder);
                        if (salesOrder.deliveryOrderCode) {
                            await this.deliveryService.cancelDocument(salesOrder.deliveryOrderCode);
                        }
                    }
                    break;
                case SalesOrderStatus.OrderPreparation:
                    salesOrder.changeStatusToOrderPreparation(status);
                    await repo.save(salesOrder);
                    break;
                case SalesOrderStatus.WaitingDelivery:
                    salesOrder.changeStatusToWaitingDelivery(status);
                    await repo.save(salesOrder);
                    break;
                case SalesOrderStatus.Delivered:
                    salesOrder.changeStatusToDeliveried(status);
                    await repo.save(salesOrder);
                    break;
                case SalesOrderStatus.Returned:
                    salesOrder.changeStatusToReturned(status);
                    await repo.save(salesOrder);
                    break;
                default:
                    break;
            }
            this.queryRunner.commitTransaction();
            return salesOrder.id;
        } catch (error) {
            this.queryRunner.rollbackTransaction();
            throw error;
        }
    }
}
