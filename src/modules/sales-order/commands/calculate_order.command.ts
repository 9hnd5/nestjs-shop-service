import { MessageConst, PromotionTypeId } from '@constants/.';
import AddSalesOrder from '@modules/sales-order/dtos/add-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder, SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { ApplyPromotionDocLine } from '../dtos/apply-promotion.dto';
import { CalculateSalesOrderResponse } from '../dtos/calculate-sales-order-response.dto';
import { SalesOrderStatus } from '../enums/sales-order-status.enum';
import { Item, SalesOrderService } from '../sales-order.service';

export class CalculateSalesOrderCommand extends BaseCommand<SalesOrderEntity> {
    data: AddSalesOrder;
}

@RequestHandler(CalculateSalesOrderCommand)
export class CalculateSalesOrderCommandHandler extends BaseCommandHandler<
    CalculateSalesOrderCommand,
    CalculateSalesOrderResponse
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
            note: data.note,
            salesmanCode: data.salesmanCode,
            salesmanName: data.salesmanName,
            postingDate: data.postingDate,
            deliveryDate: data.deliveryDate,
        });

        try {
            // Item Info for injecting Image Id, Uom info in the end
            let itemInfosAfter: Item[] = [];
            // Calculate promotion only if order came from Comatic
            const onlyNormalLines = data.items.filter((t) => t.itemType === PromotionTypeId.NORMAL);
            if (data.customerId && onlyNormalLines.length > 0) {
                const customer = await this.salesOrderService.getCustomerById(data.customerId);
                const itemInfos = await this.salesOrderService.getItemByIds(
                    onlyNormalLines.map((t) => t.itemId),
                    customer.id
                );
                itemInfosAfter = itemInfos;
                const toPromotion: ApplyPromotionDocLine[] = [];
                for (const line of onlyNormalLines) {
                    const item = itemInfos.find((t) => t.id === line.itemId);
                    const uom = item?.priceListDetails.find((t) => t.uomId === line.uomId);
                    if (!item || !uom?.price)
                        throw new BusinessException(MessageConst.MissingItemOrPrice);
                    // Get either promotion price or original price
                    const price =
                        uom.promotionPrice !== undefined &&
                        uom.promotionPrice !== null &&
                        uom.promotionPrice >= 0
                            ? uom.promotionPrice
                            : uom.price;
                    toPromotion.push({
                        item: item.code,
                        uom: uom.uomCode,
                        quantity: line.quantity,
                        unitPrice: price,
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
                    itemInfosAfter = itemInfos;
                    for (const line of promotionRs.documentLines.filter(
                        (t) =>
                            ![
                                PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE,
                                PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE,
                            ].includes(t.itemType)
                    )) {
                        const item = itemInfos.find((t) => t.code === line.item);
                        const uom = item?.priceListDetails.find((t) => t.uomCode === line.uom);
                        if (!item || !uom?.price)
                            throw new BusinessException(MessageConst.MissingItemOrPrice);

                        // Get either promotion price or original price
                        const price =
                            uom.promotionPrice !== undefined &&
                            uom.promotionPrice !== null &&
                            uom.promotionPrice >= 0
                                ? uom.promotionPrice
                                : uom.price;
                        switch (line.itemType) {
                            case PromotionTypeId.NORMAL:
                                order.addItem(
                                    SalesOrderItem.create({
                                        itemId: item.id,
                                        uomId: uom.uomId,
                                        unitPrice: price,
                                        originalPrice: uom.price,
                                        quantity: line.quantity,
                                        tax: line.tax,
                                        itemType: line.itemType,
                                        itemCode: item.code,
                                        itemName: item.name,
                                        weight: item.weight,
                                        length: item.length,
                                        width: item.width,
                                        height: item.height,
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
                                        promotionCode: line.promotionCode,
                                        promotionDescription: line.promotionDescription,
                                        itemCode: item.code,
                                        itemName: item.name,
                                        weight: item.weight,
                                        length: item.length,
                                        width: item.width,
                                        height: item.height,
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
                                            promotionCode: line.promotionCode,
                                            promotionDescription: line.promotionDescription,
                                            itemCode: item.code,
                                            itemName: item.name,
                                            weight: item.weight,
                                            length: item.length,
                                            width: item.width,
                                            height: item.height,
                                        },
                                        (line.discountValue * line.rateDiscount * price) / 100
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
                                            promotionCode: line.promotionCode,
                                            promotionDescription: line.promotionDescription,
                                            itemCode: item.code,
                                            itemName: item.name,
                                            weight: item.weight,
                                            length: item.length,
                                            width: item.width,
                                            height: item.height,
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
                                            weight: item.weight,
                                            length: item.length,
                                            width: item.width,
                                            height: item.height,
                                        },
                                        line.discountValue * line.rateDiscount
                                    )
                                );
                                break;
                        }
                    }

                    for (const line of promotionRs.documentLines.filter(
                        (t) => t.itemType === PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE
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
                                    promotionCode: line.promotionCode,
                                    promotionDescription: line.promotionDescription,
                                    weight: 0,
                                    length: 0,
                                    width: 0,
                                    height: 0,
                                },
                                line.discountValue * line.rateDiscount
                            )
                        );
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
                                    promotionCode: line.promotionCode,
                                    promotionDescription: line.promotionDescription,
                                    weight: 0,
                                    length: 0,
                                    width: 0,
                                    height: 0,
                                },
                                (line.discountValue * order.totalBeforeDiscount) / 100
                            )
                        );
                    }
                }
            } else {
                for (const item of data.items) {
                    order.addItem(
                        SalesOrderItem.create({
                            itemId: item.itemId,
                            uomId: item.uomId,
                            unitPrice: item.unitPrice,
                            quantity: item.quantity,
                            tax: item.tax ?? 0,
                            itemType: item.itemType,
                            weight: 0,
                            length: 0,
                            width: 0,
                            height: 0,
                        })
                    );
                }
            }

            const ord = order.toEntity();
            return Promise.resolve({
                ...ord,
                beforeInsert: function () {
                    return;
                },
                beforeUpdate: function () {
                    return;
                },
                items: ord.items.map((t) => {
                    const item = itemInfosAfter.find((u) => u.id === t.itemId);
                    return {
                        ...t,
                        itemImageId: item?.picture.imageId,
                        uomCode: item?.priceListDetails.find((u) => u.uomId === t.uomId)?.uomCode,
                        uomName: item?.priceListDetails.find((u) => u.uomId === t.uomId)?.uomName,
                        beforeInsert: function () {
                            return;
                        },
                        beforeUpdate: function () {
                            return;
                        },
                    };
                }),
            });
        } catch (error) {
            throw new BusinessException(error);
        }
    }
}
