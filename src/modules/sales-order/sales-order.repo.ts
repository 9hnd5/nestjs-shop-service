import { SalesOrder, SalesOrderEntity } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'be-core';
import { EntityManager, FindManyOptions, FindOneOptions, SaveOptions } from 'typeorm';

@Injectable()
export default class SalesOrderRepo extends BaseRepository<SalesOrderEntity> {
    constructor(manager: EntityManager) {
        super(manager, SalesOrderEntity);
    }

    async findOneEntity(options: FindOneOptions<SalesOrderEntity>) {
        const result = await super.findOne(options);
        if (result) {
            return SalesOrder.createFromPersistence(result);
        }
        return null;
    }

    async findEntities(options?: FindManyOptions<SalesOrderEntity> | undefined) {
        const result = await super.find(options);
        if (result) {
            return result.map((x) => SalesOrder.createFromPersistence(x));
        }
        return [];
    }

    async saveEntity(value: SalesOrder, options?: SaveOptions) {
        const entity = this.repository.create(value.toEntity());
        const result = await super.save(entity, options);
        return SalesOrder.createFromPersistence(result);
    }
}
