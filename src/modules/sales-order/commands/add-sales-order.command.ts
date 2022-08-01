import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { DataSource, QueryRunner } from 'typeorm';

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
    customerId?: number;
    customerName?: string;
    phoneNumber?: string;
    address?: string;
    @IsNotEmpty()
    contactPerson: string;
    @IsNotEmpty()
    contactNumber: string;
    @IsNotEmpty()
    shipAddress: string;
    @IsNotEmpty()
    salesChannel: string;
    @IsNotEmpty()
    salesChannelName: string;
    @IsNotEmpty()
    deliveryPartner: string;
    @IsNotEmpty()
    deliveryDate: Date;
    @IsNotEmpty()
    shippingFee: number;
    @IsNotEmpty()
    paymentMethodId: number;
    @IsNotEmpty()
    paymentMethodName: string;
    commission?: number;
    tax?: number;
    note?: string;
    discountAmount?: number;

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
            contactPerson,
            contactNumber,
            shipAddress,
            shippingFee,
            paymentMethodId,
            paymentMethodName,
            salesChannel,
            salesChannelName,
            customerId,
            customerName,
            phoneNumber,
            address,
            deliveryPartner,
            deliveryDate,
            items,
            commission,
            discountAmount,
        } = command;
        let order = new SalesOrder(
            contactPerson,
            contactNumber,
            shipAddress,
            shippingFee,
            paymentMethodId,
            paymentMethodName,
            salesChannel,
            salesChannelName,
            customerId,
            customerName,
            phoneNumber,
            address,
            deliveryPartner,
            deliveryDate,
            commission,
            discountAmount
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
            throw error;
        }
    }
}
