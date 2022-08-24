import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

export class AddSalesOrderCommand extends BaseCommand<SalesOrder> {
    data: AddSalesOrder;
}

@RequestHandler(AddSalesOrderCommand)
export class AddSalesOrderCommandHandler extends BaseCommandHandler<AddSalesOrderCommand, any> {
    private queryRunner: QueryRunner;
    constructor(dataSource: DataSource, private salesOrderRepo: SalesOrderRepo) {
        super();
        this.queryRunner = dataSource.createQueryRunner();
    }
    async apply(command: AddSalesOrderCommand) {
        const { data } = command;
        const status = data.isDraft ? SalesOrderStatus.Draft : SalesOrderStatus.New;
        const order = SalesOrder.create({
            status,
            contactPerson: data.contactPerson,
            contactPhoneNumber: data.contactPhoneNumber,
            contactAddress: data.contactAddress,
            contactAddressId: data.contactAddressId,
            salesChannelCode: data.salesChannelCode,
            salesChannelName: data.salesChannelName,
            commission: data.commission ?? 0,
            shippingFee: data.shippingFee,
            paymentMethodId: data.paymentMethodId,
            paymentMethodName: data.paymentMethodName,
            customerId: data.customerId,
            customerName: data.customerName,
            customerPhoneNumber: data.customerPhoneNumber,
            customerAddress: data.customerAddress,
            deliveryPartner: data.deliveryPartner,
            orderDiscountAmount: data.orderDiscountAmount ?? 0,
            note: data.note,
            salesmanCode: data.salesmanCode,
            salesmanName: data.salesmanName,
            postingDate: data.postingDate,
            deliveryDate: data.deliveryDate,
        });

        try {
            this.queryRunner.connect();
            this.queryRunner.startTransaction();
            const repo = this.queryRunner.manager.withRepository(this.salesOrderRepo.repository);

            for (const item of data.items) {
                order.addItem(
                    SalesOrderItem.create({
                        itemId: item.itemId,
                        uomId: item.uomId,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        tax: item.tax ?? 0,
                    })
                );
            }
            const result = await repo.save(order);
            result.code = result.generateCode(result.id);
            await repo.save(result);
            this.queryRunner.commitTransaction();

            return result.id;
        } catch (error) {
            this.queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error);
        }
    }
}
