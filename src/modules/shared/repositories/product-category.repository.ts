import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'be-core';
import { Repository } from 'typeorm';
import { ProductCategory } from '../models/product-category.model';

@Injectable({ scope: Scope.TRANSIENT })
export class ProductCategoryRepository extends BaseRepository {
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>
    ) {
        super(request);
    }
    public async add(data: ProductCategory) {
        return this.productCategoryRepository.save(data);
    }

    public async update(data: ProductCategory) {
        return await this.productCategoryRepository.save(data);
    }
}
