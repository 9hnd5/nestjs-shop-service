import { PriceListStatus } from "@constants/.";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseQueries } from "be-core";
import { Like, Repository } from "typeorm";
import { PriceListModel } from "../models/price-list.model";

@Injectable({ scope: Scope.TRANSIENT })
export class PriceListQueries extends BaseQueries {
    constructor(@Inject(REQUEST) private request: any,
        @InjectRepository(PriceListModel) private priceListRepository: Repository<PriceListModel>) {
        super(request)
    }
    
    public async get(id: number): Promise<PriceListModel | null> {
        return await this.priceListRepository.findOne({
            where: {
                id,
                isDeleted: false,
                companyId: this.request.scopeVariable.tenantId ?? 0
            }
        });
    }

    public async gets(): Promise<PriceListModel[]> {
        return await this.priceListRepository.find({
            where: {
                isDeleted: false,
                companyId: this.request.scopeVariable.tenantId ?? 0
            }
        });
    }

    public async getsPaging(currentPage: number, pageSize: number, searchText: string | undefined, viewMode: number): Promise<any> {
        const [dataSource, totalRows] = await this.priceListRepository.findAndCount({
            where: {
                isDeleted: false,
                name: searchText ? Like(`%${searchText}%`) : undefined,
                status: {
                    2: PriceListStatus.Active,
                    3: PriceListStatus.Deactive
                }[viewMode],
                companyId: this.request.scopeVariable.tenantId ?? 0
            },
            skip: pageSize * (currentPage - 1),
            take: pageSize
        });
        
        return {
            dataSource,
            totalRows,
            currentPage,
            pageSize
        };
    }
}