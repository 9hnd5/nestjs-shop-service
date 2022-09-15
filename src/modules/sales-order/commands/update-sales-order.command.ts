import { MessageConst, PromotionTypeId } from '@constants/.';
import UpdateSalesOrder from '@modules/sales-order/dtos/update-sales-order.dto';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { NotFoundException } from '@nestjs/common';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { ApplyPromotionDocLine } from '../dtos/apply-promotion.dto';
import { SalesOrderService } from '../sales-order.service';

export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    data: UpdateSalesOrder;
}

@RequestHandler(UpdateSalesOrderCommand)
export class UpdateSalesOrderCommandHanlder extends BaseCommandHandler<
    UpdateSalesOrderCommand,
    any
> {
    constructor(
        private salesOrderRepo: SalesOrderRepo,
        private salesOrderService: SalesOrderService
    ) {
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
            deliveryDate: data.deliveryDate,
            postingDate: data.postingDate,
            modifiedBy: 0,
        });

        // Calculate promotion only if order came from Comatic
        const onlyNormalLines = data.items.filter((t) => t.itemType === PromotionTypeId.NORMAL);
        if (data.customerId && onlyNormalLines.length > 0) {
            // Store ids of any lines updated, so that we can delete lines in old order which doesn't appear in new order
            const updatedLineIds: number[] = [];

            const customer = await this.salesOrderService.getCustomerById(data.customerId);
            const itemInfos = await this.salesOrderService.getItemByIds(
                onlyNormalLines.map((t) => t.itemId),
                customer.id
            );
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
                    // First we update/insert items in old order
                    const existItem = salesOrder.items.find(
                        (x) =>
                            !isNaN(x.id) &&
                            x.id > 0 &&
                            x.itemId === item.id &&
                            x.uomId === uom.uomId &&
                            x.itemType === line.itemType &&
                            (x.itemType === PromotionTypeId.NORMAL ||
                                x.promotionCode === line.promotionCode)
                    );
                    switch (line.itemType) {
                        case PromotionTypeId.NORMAL:
                            if (existItem) {
                                updatedLineIds.push(existItem.id);
                                existItem.update({
                                    itemId: item.id,
                                    uomId: uom.uomId,
                                    unitPrice: price,
                                    originalPrice: uom.price,
                                    quantity: line.quantity,
                                    itemType: line.itemType,
                                    itemCode: item.code,
                                    itemName: item.name,
                                });
                                salesOrder.updateItem(existItem.id, existItem);
                            } else {
                                salesOrder.addItem(
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
                                        height: item.weight,
                                    })
                                );
                            }
                            break;
                        case PromotionTypeId.FREE_ITEM:
                            if (existItem) {
                                updatedLineIds.push(existItem.id);
                                existItem.update({
                                    itemId: item.id,
                                    uomId: uom.uomId,
                                    unitPrice: 0,
                                    quantity: line.quantity,
                                    itemType: line.itemType,
                                    itemCode: item.code,
                                    itemName: item.name,
                                });
                                salesOrder.updateItem(existItem.id, existItem);
                            } else {
                                salesOrder.addItem(
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
                                        height: item.weight,
                                    })
                                );
                            }
                            break;
                        case PromotionTypeId.DISCOUNT_LINE_PERCENTAGE:
                            if (existItem) {
                                updatedLineIds.push(existItem.id);
                                existItem.updateDiscount(
                                    {
                                        itemId: item.id,
                                        uomId: uom.uomId,
                                        unitPrice: 0,
                                        quantity: line.quantity,
                                        itemType: line.itemType,
                                        itemCode: item.code,
                                        itemName: item.name,
                                    },
                                    (line.discountValue * line.rateDiscount * price) / 100
                                );
                                salesOrder.updateItem(existItem.id, existItem);
                            } else {
                                salesOrder.addItem(
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
                                            height: item.weight,
                                        },
                                        (line.discountValue * line.rateDiscount * price) / 100
                                    )
                                );
                            }
                            break;
                        case PromotionTypeId.DISCOUNT_LINE_VALUE:
                            if (existItem) {
                                updatedLineIds.push(existItem.id);
                                existItem.updateDiscount(
                                    {
                                        itemId: item.id,
                                        uomId: uom.uomId,
                                        unitPrice: 0,
                                        quantity: line.quantity,
                                        itemType: line.itemType,
                                        itemCode: item.code,
                                        itemName: item.name,
                                    },
                                    line.discountValue * line.rateDiscount
                                );
                                salesOrder.updateItem(existItem.id, existItem);
                            } else {
                                salesOrder.addItem(
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
                                            height: item.weight,
                                        },
                                        line.discountValue * line.rateDiscount
                                    )
                                );
                            }
                            break;
                    }
                }

                for (const line of promotionRs.documentLines.filter(
                    (t) => t.itemType === PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE
                )) {
                    const existItem = salesOrder.items.find(
                        (x) =>
                            !isNaN(x.id) &&
                            x.id > 0 &&
                            x.itemType === line.itemType &&
                            x.promotionCode === line.promotionCode
                    );
                    if (existItem) {
                        updatedLineIds.push(existItem.id);
                        existItem.updateDiscount(
                            {
                                itemId: 0,
                                uomId: 0,
                                unitPrice: 0,
                                quantity: 0,
                                itemType: line.itemType,
                            },
                            line.discountValue * line.rateDiscount
                        );
                        salesOrder.updateItem(existItem.id, existItem);
                    } else {
                        salesOrder.addItem(
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
                }

                // Wait for all other item types before discount bill percentage
                for (const line of promotionRs.documentLines.filter(
                    (t) => t.itemType === PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE
                )) {
                    const existItem = salesOrder.items.find(
                        (x) =>
                            !isNaN(x.id) &&
                            x.id > 0 &&
                            x.itemType === line.itemType &&
                            x.promotionCode === line.promotionCode
                    );
                    if (existItem) {
                        updatedLineIds.push(existItem.id);
                        existItem.updateDiscount(
                            {
                                itemId: 0,
                                uomId: 0,
                                unitPrice: 0,
                                quantity: 0,
                                itemType: line.itemType,
                            },
                            (line.discountValue * salesOrder.totalBeforeDiscount) / 100
                        );
                        salesOrder.updateItem(existItem.id, existItem);
                    } else {
                        salesOrder.addItem(
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
                                (line.discountValue * salesOrder.totalBeforeDiscount) / 100
                            )
                        );
                    }
                }

                // Then we delete lines in old promotion order which doesn't appear in new promotion order
                const toBeDeletedLineIds = [
                    ...salesOrder.items
                        .filter((t) => !isNaN(t.id) && t.id > 0 && !updatedLineIds.includes(t.id))
                        .map((t) => t.id),
                ];
                for (const id of toBeDeletedLineIds) {
                    salesOrder.removeItem(id);
                }
            }
        } else {
            // Delete lines in old order which doesn't appear in new order first
            const orderItems = [...salesOrder.items];
            for (const item of orderItems) {
                const index = data.items.findIndex((x) => x.id === item.id);
                if (index < 0) {
                    salesOrder.removeItem(item.id);
                }
            }

            // Then we update/insert lines in old order
            for (const item of data.items) {
                //update
                if (item.id) {
                    const existItem = salesOrder.items.find((x) => x.id == item.id);
                    if (existItem) {
                        existItem.update({
                            itemId: item.itemId,
                            uomId: item.uomId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            itemType: item.itemType,
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
                            itemType: item.itemType,
                            weight: 0,
                            length: 0,
                            width: 0,
                            height: 0,
                        })
                    );
                }
            }
        }

        const result = await this.salesOrderRepo.repository.save(salesOrder);
        return result.id;
    }
}
