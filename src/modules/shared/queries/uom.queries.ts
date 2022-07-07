import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Like, Repository } from 'typeorm';
import { Paging } from '.';
import { Uom } from '../models/uom.model';

@Injectable({ scope: Scope.TRANSIENT })
export class UomQueries extends BaseQueries {
    constructor(
        @Inject(REQUEST) private request: any,
        @InjectRepository(Uom) private uomRepository: Repository<Uom>
    ) {
        super(request);
    }

    public async get(id: number) {
        return this.uomRepository.findOne({
            where: {
                id,
            },
        });
    }

    public async gets() {
        return this.uomRepository.find({});
    }

    public async getPagings(param: Paging) {
        const currentRow = param.pageSize * (param.currentPage - 1);

        const [dataSource, totalRows] = await this.uomRepository.findAndCount({
            where: {
                isDeleted: false,
                name: param.searchText && Like(`%${param.searchText}%`),
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
