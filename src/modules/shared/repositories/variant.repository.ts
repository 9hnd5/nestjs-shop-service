import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';
import { Variant } from '../models/variant.model';

@Injectable({ scope: Scope.TRANSIENT })
export class VariantRepository extends BaseRepository {
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(Variant) private variantRepository: Repository<Variant>
    ) {
        super(request);
    }
    public async add(data: Variant) {
        return this.variantRepository.save(data);
    }

    public async update(data: Variant) {
        return await this.variantRepository.save(data);
    }
}
