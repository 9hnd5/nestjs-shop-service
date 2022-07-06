import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "be-core";
import { Repository } from "typeorm";
import { PriceListModel } from "../models/price-list.model";

@Injectable({ scope: Scope.TRANSIENT })
export class PriceListRepository extends BaseRepository {
    constructor(@Inject(REQUEST) request: any,
        @InjectRepository(PriceListModel) private exampleTestRepository: Repository<PriceListModel>) { 
        super(request)
    }
    public async add(data: PriceListModel): Promise<PriceListModel> {
        return await this.exampleTestRepository.save(data);
    }

    public async update(data: PriceListModel): Promise<PriceListModel> {
        return await this.exampleTestRepository.save(data)
    }
}