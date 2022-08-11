import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { SalesOrder, SalesOrderProps } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOneOptions, Repository, SaveOptions } from 'typeorm';

@Injectable()
export default class SalesOrderRepo {
    private customRepo: {
        findOne(options: FindOneOptions<SalesOrderProps>): Promise<SalesOrder | null>;
        find(options: FindManyOptions<SalesOrderProps>): Promise<SalesOrder[]>;
        save(value: SalesOrder, options?: SaveOptions | undefined): Promise<SalesOrder>;
    } & Repository<SalesOrderProps>;
    constructor(dataSource: DataSource) {
        this.customRepo = dataSource.getRepository(SalesOrderSchema).extend({
            async findOne(options: FindOneOptions<SalesOrderProps>) {
                const result = await dataSource.getRepository(SalesOrderSchema).findOne(options);
                if (result) {
                    return SalesOrder.createFromPersistence(result);
                }
                return null;
            },
            async find(options: FindManyOptions<SalesOrderProps>) {
                const result = await dataSource.getRepository(SalesOrderSchema).find(options);
                if (result) {
                    return result.map((x) => SalesOrder.createFromPersistence(x));
                }
                return [];
            },
            async save(value: SalesOrder, options?: SaveOptions) {
                const result = await dataSource
                    .getRepository(SalesOrderSchema)
                    .save(value.entity, options);
                return SalesOrder.createFromPersistence(result);
            },
        });
    }

    get repository() {
        return this.customRepo;
    }
}
