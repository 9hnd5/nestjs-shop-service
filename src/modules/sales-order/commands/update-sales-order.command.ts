import { SalesOrderEntity } from '@modules/sales-order/config/sales-order.config';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, NotFoundException, RequestHandler } from 'be-core';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

@Exclude()
class Item {
    @Expose()
    id?: number;

    @Expose()
    itemCode: string;

    @Expose()
    unitPrice: number;

    @Expose()
    quantity: number;
}
@Exclude()
export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    id: number;

    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    customerId?: number;

    @Expose()
    customerName?: string;

    @Expose()
    deliveryCode?: string;

    @Type(() => SalesOrderItem)
    @Expose()
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
        const { id, name, customerId, customerName, deliveryCode, items } = command;
        let salesOrder = await this.salesOrderRepo.findOne({
            where: { id },
            relations: {
                items: true,
            },
        });

        if (!salesOrder) {
            throw new NotFoundException('Entity not found');
        }

        salesOrder.name = name;
        salesOrder.customerId = customerId;
        salesOrder.customerName = customerName;
        salesOrder.deliveryCode = deliveryCode;
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
                    salesOrder.items[index].itemCode = item.itemCode;
                    salesOrder.items[index].quantity = item.quantity;
                    salesOrder.items[index].unitPrice = item.unitPrice;
                }
                //insert
            } else {
                const newItem = new SalesOrderItem(item.itemCode, item.unitPrice, item.quantity);
                salesOrder.addItem(newItem);
            }
        }
        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
