import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQueries } from 'be-core';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Like, Repository } from 'typeorm';
import { BrandModel } from '../models/brand.model';

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
export class BrandQueries extends BaseQueries {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) request: any,
        @InjectRepository(BrandModel) private brandRepo: Repository<BrandModel>
    ) {
        super(request);
    }

    public async get(id: number) {
        return await this.brandRepo.findOne({
            where: {
                id,
                isDeleted: false,
            },
        });
    }

    public async gets() {
        return await this.brandRepo.find({
            where: {
                isDeleted: false,
            },
        });
    }

    public async getsPaging({ pageSize, pageIndex, status, searchText }: PagingQuery) {
        const [dataSource, totalRows] = await this.brandRepo.findAndCount({
            where: {
                isDeleted: false,
                brandName: searchText ? Like(`%${searchText}%`) : undefined,
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
