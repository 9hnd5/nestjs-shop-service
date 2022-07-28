import { SalesOrderEntity } from '@modules/sales-order/config/sales-order.config';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, NotFoundException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

class Item {
    id?: number;

    @IsNotEmpty()
    itemCode: string;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    quantity: number;
}

export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    id: number;

    @IsNotEmpty()
    name: string;

    customerId?: number;

    customerName?: string;

    deliveryCode?: string;

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
