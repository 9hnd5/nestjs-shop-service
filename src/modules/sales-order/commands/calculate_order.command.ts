import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder, SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';

export class CalculateSalesOrderCommand extends BaseCommand<SalesOrderEntity> {
    data: AddSalesOrder;
}

@RequestHandler(CalculateSalesOrderCommand)
export class CalculateSalesOrderCommandHandler extends BaseCommandHandler<
    CalculateSalesOrderCommand,
    SalesOrderEntity
> {
    constructor() {
        super();
    }
    apply(command: CalculateSalesOrderCommand) {
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
            return Promise.resolve(order.toEntity());
        } catch (error) {
            throw new BusinessException(error);
        }
    }
}
