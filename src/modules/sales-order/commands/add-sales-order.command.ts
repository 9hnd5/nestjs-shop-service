import { SalesOrderEntity } from '@modules/sales-order/config/sales-order.config';
import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

class Item {
    @IsNotEmpty()
    itemCode: string;

    @IsNotEmpty()
    unitPrice: number;

    @IsNotEmpty()
    quantity: number;
}
export class AddSalesOrderCommand extends BaseCommand<SalesOrder> {
    @IsNotEmpty()
    name: string;

    customerId?: number;

    customerName?: string;

    deliveryCode?: string;

    @IsNotEmpty()
    items: Item[];
}

@RequestHandler(AddSalesOrderCommand)
export class AddSalesOrderCommandHandler extends BaseCommandHandler<AddSalesOrderCommand, any> {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        super();
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderEntity);
    }
    async apply(command: AddSalesOrderCommand) {
        const { name, customerId, customerName, deliveryCode, items } = command;
        let order = new SalesOrder(name, customerId, customerName, deliveryCode);
        for (const item of items) {
            const newItem = new SalesOrderItem(item.itemCode, item.unitPrice, item.quantity);
            order.addItem(newItem);
        }
        order = this.createBuild(order, command.session);
        const result = await this.salesOrderRepo.save(order);
        return result.id;
    }
}
