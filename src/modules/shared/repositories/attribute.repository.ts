import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';
import { AttributeModel } from './../models/attribute.model';

@Injectable({ scope: Scope.TRANSIENT })
export class AttributeRepository extends BaseRepository {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(AttributeModel) private attributeRepo: Repository<AttributeModel>
    ) {
        super(request);
    }

    add(data: AttributeModel) {
        return this.attributeRepo.save(data);
    }

    update(data: AttributeModel) {
        return this.attributeRepo.save(data);
    }
}
