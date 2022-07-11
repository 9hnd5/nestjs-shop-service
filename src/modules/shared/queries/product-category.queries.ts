import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Like, Repository } from 'typeorm';
import { Paging } from '.';
import { ProductCategory } from '../models/product-category.model';

@Injectable({ scope: Scope.TRANSIENT })
export class ProductCategoryQueries extends BaseQueries {
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(ProductCategory)
        private productCategoryRepository: Repository<ProductCategory>
    ) {
        super(request);
    }

    public async get(id: number) {
        return this.productCategoryRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async gets() {
        return this.productCategoryRepository.find({});
    }

    public async getsPaging(param: Paging) {
        const currentRow = param.pageSize * (param.currentPage - 1);

        const [dataSource, totalRows] = await this.productCategoryRepository.findAndCount({
            where: {
                isDeleted: false,
                productGroup: param.searchText && Like(`%${param.searchText}%`),
                status: {
                    2: true,
                    3: false,
                }[param.viewMode],
                companyId: this.request.scopeVariable.tenantId ?? 0,
            },
            skip: currentRow,
            take: param.pageSize,
        });

        return {
            dataSource,
            totalRows,
            currentPage: param.pageSize,
            currentPageSize: param.currentPage,
        };
    }
}
