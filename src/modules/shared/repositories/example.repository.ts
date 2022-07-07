import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';
import { ExampleModel } from '../models/example.model';

@Injectable({ scope: Scope.TRANSIENT })
export class ExampleRepository extends BaseRepository {
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(ExampleModel) private exampleTestRepository: Repository<ExampleModel>
    ) {
        super(request);
    }
    public async add(data: ExampleModel): Promise<ExampleModel> {
        return this.exampleTestRepository.save(data);
    }

    public async update(data: ExampleModel): Promise<ExampleModel> {
        return await this.exampleTestRepository.save(data);
    }
}
