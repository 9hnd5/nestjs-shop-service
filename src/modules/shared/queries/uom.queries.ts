import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseQueries } from "be-core";
import { take } from "rxjs";
import { Like, Repository } from "typeorm";
import { Paging } from ".";
import { Uom } from "../models/uom.model";

@Injectable({ scope: Scope.TRANSIENT })
export class UomQueries extends BaseQueries {

    constructor(@Inject(REQUEST) request: any,
        @InjectRepository(Uom) private uomRepository: Repository<Uom>) {
        super(request)
    }
    
    public async get(id: number){
        return this.uomRepository.findOne({
            where: {
                id
            }
        })
    }

    public async gets() {
        return this.uomRepository.find({})
    }

    public async getPagings(param: Paging) : Promise<object> 
    {
        const currentRow = param.pageSize * (param.currentPage - 1)

        let conds = "uom.isDeleted = false"
        if (param.searchText) {
            conds += ` AND uom.name like '${param.searchText}'`
        }
        if (param.viewMode == 2)
        {
            conds += ` AND uom.status = true`
        } 
        else if (param.viewMode == 3) 
        {      
            conds += ` AND uom.status = false`
        }

        const result = await this.uomRepository
        .createQueryBuilder("uom").where(conds)
        .take(param.pageSize).skip(currentRow).getMany()

        const totalRows = await this.uomRepository.createQueryBuilder("uom").where(conds).getCount()
        return  {
                    dataSource: result,
                    currentPage: param.currentPage,
                    currentPageSize: param.pageSize,
                    totalRows: totalRows,
                };

    }
}