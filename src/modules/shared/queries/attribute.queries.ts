import { AttributeModel } from './../models/attribute.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries, QueryModel } from 'be-core';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Like, Repository } from 'typeorm';

export class PagingQuery extends QueryModel {
    status?: string;
    searchText?: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class AttributeQueries extends BaseQueries {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(AttributeModel) private attributeRepo: Repository<AttributeModel>
    ) {
        super(request);
    }

    get(id: number) {
        return this.attributeRepo.findOne({
            where: {
                id,
                isDeleted: false,
            },
        });
    }

    gets() {
        return this.attributeRepo.find({
            where: {
                isDeleted: false,
            },
        });
    }

    async getsPaging({ pageSize, pageIndex, status, searchText }: PagingQuery) {

        let condition = {
            isDeleted: false,
            status: status ? status : undefined
        }
        const [dataSource, totalRows] = await this.attributeRepo.findAndCount({
            where:
                searchText ?
                    [
                        { ...condition, attributeCode: searchText ? Like(`%${searchText}%`) : undefined },
                        { ...condition, attributeName: searchText ? Like(`%${searchText}%`) : undefined }
                    ] : condition,
            take: pageSize,
            skip: pageSize * (pageIndex - 1),
        });

        const result = {
            dataSource,
            totalRows,
            pageIndex,
            pageSize,
        };
        return result;
    }
}
