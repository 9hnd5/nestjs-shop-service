import { AttributeModel } from './../models/attribute.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Like, Repository } from 'typeorm';

export class PagingQuery {
    @Transform(({ value }) => +value)
    @IsNumber()
    pageSize: number;

    @Transform(({ value }) => +value)
    pageIndex: number;
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
        const [dataSource, totalRows] = await this.attributeRepo.findAndCount({
            where: {
                isDeleted: false,
                attributeCode: searchText ? Like(`%${searchText}%`) : undefined,
                status: status ? status : undefined,
            },
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
