import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';
import { PriceListModel } from '../models/price-list.model';

@Injectable({ scope: Scope.TRANSIENT })
export class PriceListRepository extends BaseRepository {
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(PriceListModel) private pricelistRepository: Repository<PriceListModel>
    ) {
        super(request);
    }
    public async add(data: PriceListModel): Promise<PriceListModel> {
        data.companyId = this.request.scopeVariable.tenantId ?? 0;
        return await this.pricelistRepository.save(data);
    }

    public async update(data: PriceListModel): Promise<PriceListModel> {
        return await this.pricelistRepository.save(data);
    }
}
