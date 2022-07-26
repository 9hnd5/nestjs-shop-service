import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, NotFoundException, RequestHandler } from 'be-core';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { remove } from 'lodash';
import { DataSource, Repository } from 'typeorm';

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
export class UpdateSalesOrderCommand extends BaseCommand<SalesOrder> {
    @Expose()
    @IsNotEmpty()
    id: number;

    @Expose()
    @IsNotEmpty()
    name: string;

    @Expose()
    @IsNotEmpty()
    status: string;

    @Expose()
    @IsNotEmpty()
    customerId: number;

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
        this.salesOrderRepo = dataSource.getRepository(SalesOrder);
    }
    async apply(command: UpdateSalesOrderCommand) {
        let salesOrder = await this.salesOrderRepo.findOne({
            where: { id: command.id },
            relations: {
                items: true,
            },
        });
        if (!salesOrder) {
            throw new NotFoundException('Entity not found');
        }
        salesOrder.name = command.name;
        salesOrder.status = command.status;
        salesOrder.customerId = command.customerId;
        salesOrder = this.updateBuild(salesOrder, command.session);

        const orderItems = [...salesOrder.items];
        for (const item of orderItems) {
            const index = command.items.findIndex((x) => x.id === item.id);
            console.log(index);
            if (index < 0) {
                remove(salesOrder.items, (x) => x.id === item.id);
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
                const newItem = new SalesOrderItem();
                newItem.itemCode = item.itemCode;
                newItem.quantity = item.quantity;
                newItem.unitPrice = item.unitPrice;
                salesOrder.items.push(newItem);
            }
        }
        const result = await this.salesOrderRepo.save(salesOrder);
        return result.id;
    }
}
