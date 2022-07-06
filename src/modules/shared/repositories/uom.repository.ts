import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "be-core";
import { Repository } from "typeorm";
import { Uom } from "../models/uom.model";

@Injectable({ scope: Scope.TRANSIENT })
export class UomRepository extends BaseRepository {
    
    constructor(@Inject(REQUEST)request: any,
        @InjectRepository(Uom) private uomRepository: Repository<Uom>) { 
        super(request)
    }
    public async add(data: Uom) {
        return this.uomRepository.save(data);
    }

    public async update(data: Uom) {
        return await this.uomRepository.save(data)
    }
}