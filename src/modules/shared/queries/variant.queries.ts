import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Like, Repository } from 'typeorm';
import { Paging } from '.';
import { Variant } from '../models/variant.model';

@Injectable({ scope: Scope.TRANSIENT })
export class VariantQueries extends BaseQueries {
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(Variant) private variantRepository: Repository<Variant>
    ) {
        super(request);
    }

    public async get(id: number) {
        return this.variantRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async gets() {
        return this.variantRepository.find({});
    }

    public async getsPaging(param: Paging) {
        const currentRow = param.pageSize * (param.currentPage - 1);

        const [dataSource, totalRows] = await this.variantRepository.findAndCount({
            where: {
                isDeleted: false,
                variantName: param.searchText && Like(`%${param.searchText}%`),
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
