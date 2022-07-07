import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Repository } from 'typeorm';
import { ExampleModel } from '../models/example.model';

@Injectable({ scope: Scope.TRANSIENT })
export class ExampleQueries extends BaseQueries {
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(ExampleModel) private exampleTestRepository: Repository<ExampleModel>
    ) {
        super(request);
    }

    public async get(id: number): Promise<ExampleModel | null> {
        return this.exampleTestRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async gets() {
        return this.exampleTestRepository.find();
    }
}
