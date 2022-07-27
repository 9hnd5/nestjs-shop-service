import { GetByIdResponse } from '@modules/sales-order/dtos/get-by-id-response.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { SummaryQuery } from '@modules/sales-order/dtos/summary-query.dto';
import { SummaryResponse } from '@modules/sales-order/dtos/summary-response.dto';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { Paginated } from 'be-core';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SalesOrderQuery {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource) {
        this.salesOrderRepo = dataSource.getRepository(SalesOrder);
    }

    async get(query: GetQuery) {
        const { pageIndex, pageSize, status } = query;
        const [dataSource, totalRow] = await this.salesOrderRepo.findAndCount({
            where: {
                status,
            },
            take: pageSize,
            skip: pageSize * (pageIndex - 1),
        });

        const result = plainToInstance(GetResponse, dataSource, { excludeExtraneousValues: true });
        const response: Paginated<GetResponse> = {
            pageIndex,
            pageSize,
            totalRow,
            dataSource: result,
        };

        return response;
    }

    async getById(id: number) {
        const salesOrder = await this.salesOrderRepo.findOne({
            where: { id },
            relations: { items: true },
        });
        const response = plainToInstance(GetByIdResponse, salesOrder, {
            excludeExtraneousValues: true,
        });
        return response;
    }

    async getSummary(query: SummaryQuery) {
        const { fromDate, toDate } = query;
        const result = await this.salesOrderRepo
            .createQueryBuilder('s')
            .where('s.created_date >= :fromDate', { fromDate: fromDate?.toISOString() })
            .andWhere('s.created_date < :toDate', { toDate: toDate?.toISOString() })
            .groupBy('s.status')
            .select(['count(s.status) as count', 's.status as status'])
            .getRawMany();
        const response = plainToInstance(SummaryResponse, result);
        return response;
    }
}
