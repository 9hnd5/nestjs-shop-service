import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { Type } from 'class-transformer';
import { Allow, ArrayNotEmpty, IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

class Item {
    @IsNotEmpty()
    itemId: number;

    @IsNotEmpty()
    uomId: number;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    quantity: number;

    tax?: number;
}
export class AddSalesOrderCommand extends BaseCommand<SalesOrder> {
    @Allow()
    customerId?: number;
    @Allow()
    customerName?: string;
    @Allow()
    phoneNumber?: string;
    @Allow()
    address?: string;
    @IsNotEmpty()
    contactPerson: string;
    @IsNotEmpty()
    contactNumber: string;
    @IsNotEmpty()
    shipAddress: string;
    @IsNotEmpty()
    salesChannelCode: string;
    @IsNotEmpty()
    salesChannelName: string;
    @IsNotEmpty()
    deliveryPartner: string;
    @Type(() => Date)
    @IsDate()
    deliveryDate: Date;
    @IsDate()
    @Type(() => Date)
    postingDate: Date;
    @IsNotEmpty()
    shippingFee: number;
    @IsNotEmpty()
    paymentMethodId: number;
    @IsNotEmpty()
    paymentMethodName: string;
    @Allow()
    commission?: number;
    @Allow()
    tax?: number;
    @Allow()
    note?: string;
    @Allow()
    orderDiscountAmount?: number;
    @Allow()
    isDraft: boolean;

    status?: string;

    @ArrayNotEmpty()
    @ValidateNested()
    @Type(() => Item)
    items: Item[];
}

@RequestHandler(AddSalesOrderCommand)
export class AddSalesOrderCommandHandler extends BaseCommandHandler<AddSalesOrderCommand, any> {
    private queryRunner: QueryRunner;
    constructor(dataSource: DataSource) {
        super();
        this.queryRunner = dataSource.createQueryRunner();
    }
    async apply(command: AddSalesOrderCommand) {
        const {
            status = command.isDraft ? SalesOrderStatus.Draft : SalesOrderStatus.New,
            contactPerson,
            contactNumber,
            shipAddress,
            shippingFee,
            paymentMethodId,
            paymentMethodName,
            salesChannelCode,
            salesChannelName,
            customerId,
            customerName,
            phoneNumber,
            address,
            deliveryPartner,
            deliveryDate,
            postingDate,
            items,
            commission,
            orderDiscountAmount,
            note,
        } = command;
        let order = new SalesOrder(
            status,
            contactPerson,
            contactNumber,
            shipAddress,
            shippingFee,
            paymentMethodId,
            paymentMethodName,
            salesChannelCode,
            salesChannelName,
            deliveryDate,
            deliveryPartner,
            postingDate,
            customerId,
            customerName,
            phoneNumber,
            address,
            commission,
            orderDiscountAmount,
            note
        );
        try {
            this.queryRunner.connect();
            this.queryRunner.startTransaction();

            for (const item of items) {
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
