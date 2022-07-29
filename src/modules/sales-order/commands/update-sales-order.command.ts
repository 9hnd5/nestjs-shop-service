import { SalesOrderEntity } from '@modules/sales-order/config/sales-order.config';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, NotFoundException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

class Item {
    id?: number;

    @IsNotEmpty()
    itemId: number;

    @IsNotEmpty()
    uomId: number;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    quantity: number;

    tax: number;
}

export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    id: number;

    @IsNotEmpty()
    code: string;

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
    deliveryPartner: string;
    @IsNotEmpty()
    deliveryDate: Date;

    shippingFee: number;

    paymentMethodId: number;

    totalDiscountAmount: number;

    commission: number;

    tax: number;

    note: string;

    @IsNotEmpty()
    items: Item[];
}

@RequestHandler(UpdateSalesOrderCommand)
export class UpdateSalesOrderCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderCommand,
    any
> {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        super();
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderEntity);
    }
    async apply(command: UpdateSalesOrderCommand) {
        const {
            id,
            code,
            contactPerson,
            contactNumber,
            shipAddress,
            shippingFee,
            paymentMethodId,
            customerId,
            customerName,
            phoneNumber,
            deliveryPartner,
            items,
        } = command;
        let salesOrder = await this.salesOrderRepo.findOne({
            where: { id },
            relations: {
                items: true,
            },
        });

        if (!salesOrder) {
            throw new NotFoundException('Entity not found');
        }

        salesOrder.contactPerson = contactPerson;
        salesOrder.contactNumber = contactNumber;
        salesOrder.shipAddress = shipAddress;
        salesOrder.code = code;
        salesOrder.shippingFee = shippingFee;
        salesOrder.paymentMethodId = paymentMethodId;
        salesOrder.customerId = customerId;
        salesOrder.customerName = customerName;
        salesOrder.phoneNumber = phoneNumber;
        salesOrder.deliveryPartner = deliveryPartner;
        salesOrder = this.updateBuild(salesOrder, command.session);

        const orderItems = [...salesOrder.items];
        for (const item of orderItems) {
            const index = items.findIndex((x) => x.id === item.id);
            if (index < 0) {
                salesOrder.removeItem(item.id);
            }
        }

        for (const item of command.items) {
            //update
            if (item.id) {
                const index = salesOrder.items.findIndex((x) => x.id == item.id);
                if (index >= 0) {
                    salesOrder.items[index].itemId = item.itemId;
                    salesOrder.items[index].uomId = item.uomId;
                    salesOrder.items[index].quantity = item.quantity;
                    salesOrder.items[index].unitPrice = item.unitPrice;
                }
                //insert
            } else {
                const newItem = new SalesOrderItem(
                    item.itemId,
                    item.uomId,
                    item.unitPrice,
                    item.quantity,
                    item.tax
                );
                salesOrder.addItem(newItem);
            }
        }
        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
