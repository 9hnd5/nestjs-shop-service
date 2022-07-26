import { SalesOrderItem } from '@modules/sales-order/entities/sales-order-item.entity';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { DataSource, Repository } from 'typeorm';

class Item {
    @Expose()
    itemCode: string;
    @Expose()
    unitPrice: number;
    @Expose()
    quantity: number;
}
@Exclude()
export class AddSalesOrderCommand extends BaseCommand<SalesOrder> {
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

@RequestHandler(AddSalesOrderCommand)
export class AddSalesOrderCommandHandler extends BaseCommandHandler<AddSalesOrderCommand, number> {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        super();
        this.salesOrderRepo = dataSource.getRepository(SalesOrder);
    }
    async apply(command: AddSalesOrderCommand) {
        let order = plainToInstance(SalesOrder, command);
        order = this.createBuild(order, command.session);
        order.modifiedBy = 0;
        order.modifiedDate = new Date();
        const result = await this.salesOrderRepo.save(order);
        return result.id;
    }
}
