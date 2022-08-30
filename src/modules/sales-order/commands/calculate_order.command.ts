import { MessageConst, PromotionTypeId } from '@constants/.';
import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder, SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { ApplyPromotionDocLine } from '../dtos/apply-promotion.dto';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';
import { SalesOrderService } from '../sales-order.service';

export class CalculateSalesOrderCommand extends BaseCommand<SalesOrderEntity> {
    data: AddSalesOrder;
}

@RequestHandler(CalculateSalesOrderCommand)
export class CalculateSalesOrderCommandHandler extends BaseCommandHandler<
    CalculateSalesOrderCommand,
    SalesOrderEntity
> {
    constructor(private salesOrderService: SalesOrderService) {
        super();
    }
    async apply(command: CalculateSalesOrderCommand) {
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
            // Calculate promotion
            if (data.customerId) {
                const customer = await this.salesOrderService.getCustomerById(data.customerId);
                const itemInfos = await this.salesOrderService.getItemByIds(
                    data.items.map((t) => t.itemId),
                    customer.id
                );
                const toPromotion: ApplyPromotionDocLine[] = [];
                for (const line of data.items) {
                    const item = itemInfos.find((t) => t.id === line.itemId);
                    const uom = item?.priceListDetails.find((t) => t.uomId === line.uomId);
                    if (!item || !uom) throw new BusinessException(MessageConst.MissingItemOrPrice);
                    toPromotion.push({
                        item: item.code,
                        uom: uom.uomCode,
                        quantity: line.quantity,
                        unitPrice: line.unitPrice,
                        itemType: PromotionTypeId.NORMAL,
                        tax: line.tax ?? 0,
                        discountValue: 0,
                        rateDiscount: 0,
                    });
                }
                const promotionRs = await this.salesOrderService.applyPromotion({
                    customer: customer.code,
                    documentLines: toPromotion,
                });
                if (promotionRs.documentLines.length > 0) {
                    // After applying promotion, get items again because of changes in promotion result
                    const itemInfos = await this.salesOrderService.getItemByCodes(
                        promotionRs.documentLines
                            .filter(
                                (t) =>
                                    ![
                                        PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE,
                                        PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE,
                                    ].includes(t.itemType)
                            )
                            .map((t) => t.item),
                        customer.id
                    );
                    for (const line of promotionRs.documentLines.filter(
                        (t) => t.itemType !== PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE
                    )) {
                        const item = itemInfos.find((t) => t.code === line.item);
                        const uom = item?.priceListDetails.find((t) => t.uomCode === line.uom);
                        if (!item || !uom?.price)
                            throw new BusinessException(MessageConst.MissingItemOrPrice);

                        switch (line.itemType) {
                            case PromotionTypeId.NORMAL:
                                order.addItem(
                                    SalesOrderItem.create({
                                        itemId: item.id,
                                        uomId: uom.uomId,
                                        unitPrice: line.unitPrice,
                                        quantity: line.quantity,
                                        tax: line.tax,
                                        itemType: line.itemType,
                                    })
                                );
                                break;
                            case PromotionTypeId.FREE_ITEM:
                                order.addItem(
                                    SalesOrderItem.create({
                                        itemId: item.id,
                                        uomId: uom.uomId,
                                        unitPrice: 0,
                                        quantity: line.quantity,
                                        tax: 0,
                                        itemType: line.itemType,
                                    })
                                );
                                break;
                            case PromotionTypeId.DISCOUNT_LINE_PERCENTAGE:
                                order.addItem(
                                    SalesOrderItem.createDiscountLine(
                                        {
                                            itemId: item.id,
                                            uomId: uom.uomId,
                                            unitPrice: 0,
                                            quantity: line.quantity,
                                            tax: 0,
                                            itemType: line.itemType,
                                        },
                                        (line.discountValue * line.rateDiscount * uom.price) / 100
                                    )
                                );
                                break;
                            case PromotionTypeId.DISCOUNT_LINE_VALUE:
                                order.addItem(
                                    SalesOrderItem.createDiscountLine(
                                        {
                                            itemId: item.id,
                                            uomId: uom.uomId,
                                            unitPrice: 0,
                                            quantity: line.quantity,
                                            tax: 0,
                                            itemType: line.itemType,
                                        },
                                        line.discountValue * line.rateDiscount
                                    )
                                );
                                break;
                            case PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE:
                                order.addItem(
                                    SalesOrderItem.createDiscountLine(
                                        {
                                            itemId: item.id,
                                            uomId: uom.uomId,
                                            unitPrice: 0,
                                            quantity: 0,
                                            tax: 0,
                                            itemType: line.itemType,
                                        },
                                        line.discountValue * line.rateDiscount
                                    )
                                );
                                break;
                        }
                    }

                    // Wait for all other item types before discount bill percentage
                    for (const line of promotionRs.documentLines.filter(
                        (t) => t.itemType === PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE
                    )) {
                        order.addItem(
                            SalesOrderItem.createDiscountLine(
                                {
                                    itemId: 0,
                                    uomId: 0,
                                    unitPrice: 0,
                                    quantity: 0,
                                    tax: 0,
                                    itemType: line.itemType,
                                },
                                line.discountValue * order.totalBeforeDiscount
                            )
                        );
                    }
                }
            }

            return Promise.resolve(order.toEntity());
        } catch (error) {
            throw new BusinessException(error);
        }
    }
}
