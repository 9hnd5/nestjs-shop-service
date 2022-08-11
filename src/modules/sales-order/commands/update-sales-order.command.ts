import UpdateSalesOrder from '@modules/sales-order/dtos/update-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';

export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    data: UpdateSalesOrder;
}

@RequestHandler(UpdateSalesOrderCommand)
export class UpdateSalesOrderCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderCommand,
    any
> {
    constructor(private salesOrderRepo: SalesOrderRepo) {
        super();
    }
    async apply(command: UpdateSalesOrderCommand) {
        const { data } = command;
        const salesOrder = await this.salesOrderRepo.repository.findOne({
            where: { id: data.id },
            relations: {
                items: true,
            },
        });

        if (!salesOrder) {
            throw new NotFoundException('Entity not found');
        }
        salesOrder.update({
            contactPerson: data.contactPerson,
            contactNumber: data.contactNumber,
            shipAddress: data.shipAddress,
            salesChannelCode: data.salesChannelCode,
            salesChannelName: data.salesChannelName,
            commission: data.commission ?? 0,
            shippingFee: data.shippingFee,
            paymentMethodId: data.paymentMethodId,
            paymentMethodName: data.paymentMethodName,
            customerId: data.customerId,
            customerName: data.customerName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            deliveryPartner: data.deliveryPartner,
            orderDiscountAmount: data.orderDiscountAmount ?? 0,
            note: data.note,
            salesmanCode: data.salesmanCode,
            salesmanName: data.salesmanName,
            deliveryDate: data.deliveryDate,
        });
        data.postingDate && salesOrder.changePostingDate(data.postingDate);

        const orderItems = [...salesOrder.items];
        for (const item of orderItems) {
            const index = data.items.findIndex((x) => x.id === item.id);
            if (index < 0) {
                salesOrder.removeItem(item.entity.id);
            }
        }

        for (const item of data.items) {
            //update
            if (item.id) {
                const existItem = salesOrder.items.find((x) => x.entity.id == item.id);
                if (existItem) {
                    existItem.update({
                        itemId: item.itemId,
                        uomId: item.uomId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    });
                    salesOrder.updateItem(item.id, existItem);
                }
                //insert
            } else {
                salesOrder.addItem(
                    SalesOrderItem.create({
                        itemId: item.itemId,
                        uomId: item.uomId,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        tax: item.tax ?? 0,
                    })
                );
            }
        }
        // salesOrder.calcTotalAmount();
        const result = await this.salesOrderRepo.repository.save(salesOrder);
        return result.entity.id;
    }
}
