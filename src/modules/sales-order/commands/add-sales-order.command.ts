import { AddSalesOrderDto } from '@modules/sales-order/dtos/add-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

export class AddSalesOrderCommand extends BaseCommand<SalesOrder> {
    data: AddSalesOrderDto;
}

@RequestHandler(AddSalesOrderCommand)
export class AddSalesOrderCommandHandler extends BaseCommandHandler<AddSalesOrderCommand, any> {
    private queryRunner: QueryRunner;
    constructor(dataSource: DataSource) {
        super();
        this.queryRunner = dataSource.createQueryRunner();
    }
    async apply(command: AddSalesOrderCommand) {
        const { data } = command;
        const status = data.isDraft ? SalesOrderStatus.Draft : SalesOrderStatus.New;
        let order = new SalesOrder(
            status,
            data.contactPerson,
            data.contactNumber,
            data.shipAddress,
            data.shippingFee,
            data.paymentMethodId,
            data.paymentMethodName,
            data.salesChannelCode,
            data.salesChannelName,
            data.deliveryDate,
            data.deliveryPartner,
            data.postingDate,
            data.customerId,
            data.customerName,
            data.phoneNumber,
            data.address,
            data.commission,
            data.orderDiscountAmount,
            data.note
        );
        try {
            this.queryRunner.connect();
            this.queryRunner.startTransaction();

            for (const item of data.items) {
                let newItem = new SalesOrderItem(
                    item.itemId,
                    item.uomId,
                    item.unitPrice,
                    item.quantity,
                    item.tax
                );
                newItem = this.createBuild(newItem, command.session);
                order.addItem(newItem);
            }
            order = this.createBuild(order, command.session);
            const result = await this.queryRunner.manager.save(order);

            result.code = result.generateCode(result.id);
            await this.queryRunner.manager.save(result);
            this.queryRunner.commitTransaction();

            return result.id;
        } catch (error) {
            this.queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error);
        }
    }
}
