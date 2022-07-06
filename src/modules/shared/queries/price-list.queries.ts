import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseQueries } from "be-core";
import { Like, Repository } from "typeorm";
import { PriceListModel } from "../models/price-list.model";

@Injectable({ scope: Scope.TRANSIENT })
export class PriceListQueries extends BaseQueries {
    constructor(@Inject(REQUEST) request: any,
        @InjectRepository(PriceListModel) private priceListRepository: Repository<PriceListModel>) {
        super(request)
    }
    
    public async get(id: number): Promise<PriceListModel> {
        return await this.priceListRepository.findOne({
            where: {
                id,
                isDeleted: false
            }
        });
    }

    public async gets() {
        return await this.priceListRepository.find({ where: {isDeleted: false} });
    }

    public async getsPaging(currentPage: number, pageSize: number, searchText: string, viewMode: number) {
        const condition = {
            isDeleted: false
        };

        if (searchText) {
            condition['name'] = Like(`%${searchText}%`);
        }

        if (viewMode === 2) {
            condition['status'] = true;
        } else if (viewMode === 3) {
            condition['status'] = false;
        }

        const dataSource = await this.priceListRepository.find({
            where: condition,
            skip: pageSize * (currentPage - 1),
            take: pageSize
        });
        const count = await this.priceListRepository.count({
            where: condition
        });
        return {
            dataSource,
            totalRows: count,
            currentPage, pageSize
        };
    }
}