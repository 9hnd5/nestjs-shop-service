import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { UpdateSalesOrderDto } from '@modules/sales-order/dtos/update-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { DataSource, Repository } from 'typeorm';

export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    data: UpdateSalesOrderDto;
}

@RequestHandler(UpdateSalesOrderCommand)
export class UpdateSalesOrderCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderCommand,
    any
> {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        super();
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderSchema);
    }
    async apply(command: UpdateSalesOrderCommand) {
        const { data } = command;
        let salesOrder = await this.salesOrderRepo.findOne({
            where: { id: data.id },
            relations: {
                items: true,
            },
        });

        if (!salesOrder) {
            throw new NotFoundException('Entity not found');
        }

        salesOrder.contactPerson = data.contactPerson;
        salesOrder.contactNumber = data.contactNumber;
        salesOrder.shipAddress = data.shipAddress;
        salesOrder.salesChannelCode = data.salesChannelCode;
        salesOrder.salesChannelName = data.salesChannelName;
        salesOrder.commission = data.commission ?? 0;
        salesOrder.shippingFee = data.shippingFee;
        salesOrder.paymentMethodId = data.paymentMethodId;
        salesOrder.paymentMethodName = data.paymentMethodName;
        salesOrder.customerId = data.customerId;
        salesOrder.customerName = data.customerName;
        salesOrder.phoneNumber = data.phoneNumber;
        salesOrder.address = data.address;
        salesOrder.deliveryPartner = data.deliveryPartner;
        salesOrder.orderDiscountAmount = data.orderDiscountAmount ?? 0;
        salesOrder.note = data.note;
        salesOrder.changeDeliveryDate(data.deliveryDate);
        data.postingDate && salesOrder.changePostingDate(data.postingDate);
        salesOrder = this.updateBuild(salesOrder, command.session);

        const orderItems = [...salesOrder.items];
        for (const item of orderItems) {
            const index = data.items.findIndex((x) => x.id === item.id);
            if (index < 0) {
                salesOrder.removeItem(item.id);
            }
        }

        for (const item of data.items) {
            //update
            if (item.id) {
                const index = salesOrder.items.findIndex((x) => x.id == item.id);
                if (index >= 0) {
                    salesOrder.items[index].itemId = item.itemId;
                    salesOrder.items[index].uomId = item.uomId;
                    salesOrder.items[index].changeQuantity(item.quantity);
                    salesOrder.items[index].changeUnitPrice(item.unitPrice);
                }
                //insert
            } else {
                let newItem = new SalesOrderItem(
                    item.itemId,
                    item.uomId,
                    item.unitPrice,
                    item.quantity,
                    item.tax
                );
                newItem = this.createBuild(newItem, command.session);
                salesOrder.addItem(newItem);
            }
        }
        salesOrder.calcTotalAmount();
        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
