import { BrandModel } from './../models/brand.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.TRANSIENT })
export class BrandRepository extends BaseRepository {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(BrandModel) private brandRepo: Repository<BrandModel>
    ) {
        super(request);
    }

    public async add(data: BrandModel): Promise<BrandModel> {
        return await this.brandRepo.save(data);
    }

    public async update(data: BrandModel): Promise<BrandModel> {
        return await this.brandRepo.save(data);
    }
}
