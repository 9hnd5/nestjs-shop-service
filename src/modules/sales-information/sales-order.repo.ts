import { SalesOrder, SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, FindOneOptions, Repository, SaveOptions } from 'typeorm';

type Repo = {
    findOne: (options: FindOneOptions<SalesOrderEntity>) => Promise<SalesOrder | null>;
    find: (options: FindManyOptions<SalesOrderEntity>) => Promise<SalesOrder[]>;
    save: (value: SalesOrder, options?: SaveOptions) => Promise<SalesOrder>;
} & Repository<SalesOrderEntity>;

@Injectable()
export default class SalesOrderRepo {
    private defaultRepository: Repository<SalesOrderEntity>;
    constructor(dataSource: DataSource) {
        this.defaultRepository = dataSource.getRepository(SalesOrderEntity);
    }

    get repository(): Repo {
        const defaultRepository = this.defaultRepository;
        return defaultRepository.extend({
            async findOne(options: FindOneOptions<SalesOrderEntity>) {
                const result = await defaultRepository.findOne(options);
                if (result) {
                    return SalesOrder.createFromPersistence(result);
                }
                return null;
            },
            async find(options: FindManyOptions<SalesOrderEntity>) {
                const result = await defaultRepository.find(options);
                if (result) {
                    return result.map((x) => SalesOrder.createFromPersistence(x));
                }
                return [];
            },
            async save(value: SalesOrder, options?: SaveOptions) {
                const entity = defaultRepository.create(value.toEntity());
                const result = await defaultRepository.save(entity, options);
                return SalesOrder.createFromPersistence(result);
            },
        });
    }
}
