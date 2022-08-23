import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { SalesOrder, SalesOrderProps } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOneOptions, Repository, SaveOptions } from 'typeorm';

type Repo = {
    findOne: (options: FindOneOptions<SalesOrderProps>) => Promise<SalesOrder | null>;
    find: (options: FindManyOptions<SalesOrderProps>) => Promise<SalesOrder[]>;
    save: (value: SalesOrder, options?: SaveOptions) => Promise<SalesOrder>;
} & Repository<SalesOrderProps>;

@Injectable()
export default class SalesOrderRepo {
    private defaultRepository: Repository<SalesOrderProps>;
    constructor(dataSource: DataSource) {
        this.defaultRepository = dataSource.getRepository(SalesOrderSchema);
    }

    get repository(): Repo {
        const defaultRepository = this.defaultRepository;
        return defaultRepository.extend({
            async findOne(options: FindOneOptions<SalesOrderProps>) {
                const result = await defaultRepository.findOne(options);
                if (result) {
                    return SalesOrder.createFromPersistence(result);
                }
                return null;
            },
            async find(options: FindManyOptions<SalesOrderProps>) {
                const result = await defaultRepository.find(options);
                if (result) {
                    return result.map((x) => SalesOrder.createFromPersistence(x));
                }
                return [];
            },
            async save(value: SalesOrder, options?: SaveOptions) {
                const result = await defaultRepository.save(value.entity, options);
                return SalesOrder.createFromPersistence(result);
            },
        });
    }
}
