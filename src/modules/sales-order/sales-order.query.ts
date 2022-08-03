import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { GetByIdResponse } from '@modules/sales-order/dtos/get-by-id-response.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { CountStatus, SummaryResponse } from '@modules/sales-order/dtos/summary-response.dto';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { SalesOrderService } from '@modules/sales-order/sales-order.service';
import { Injectable } from '@nestjs/common';
import { Paginated } from 'be-core';
import { plainToInstance } from 'class-transformer';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class SalesOrderQuery {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource, private salesOrderService: SalesOrderService) {
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderSchema);
    }

    async get(query: GetQuery) {
        const { pageIndex, pageSize, status, searchText, salesChannelCode, fromDate, toDate } =
            query;

        let cond = this.salesOrderRepo
            .createQueryBuilder('s')
            .where('s.is_deleted = :isDeleted', { isDeleted: false })
            .andWhere('s.created_date >= :fromDate', {
                fromDate: fromDate.toISOString(),
            })
            .andWhere('s.created_date <= :toDate', { toDate: toDate.toISOString() })
            .take(pageSize)
            .skip(pageSize * (pageIndex - 1));

        if (status) {
            cond = cond.andWhere('s.status = :status', { status });
        }
        if (salesChannelCode) {
            cond = cond.andWhere('s.sales_channel_code = :salesChannelCode', { salesChannelCode });
        }
        if (searchText) {
            cond = cond.andWhere(
                new Brackets((qb) => {
                    qb.where('s.code = :searchCode', { searchCode: searchText }).orWhere(
                        's.customer_name like :searchText',
                        { searchText: `%${searchText}%` }
                    );
                })
            );
        }

        const [dataSource, totalRow] = await cond.getManyAndCount();
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
            where: { id, isDeleted: false },
            relations: { items: true },
        });
        let response = plainToInstance(GetByIdResponse, salesOrder, {
            excludeExtraneousValues: true,
        });
        if (salesOrder && salesOrder.items.length > 0) {
            const itemIds = salesOrder.items.map((t) => t.itemId);
            const customerId = salesOrder.customerId ?? 0;
            const itemsRs = await this.salesOrderService.getItemByIds(itemIds, customerId);
            const itemsWithPrice = itemsRs.data;
            for (const line of response.items) {
                const item = itemsWithPrice.find((t) => t.id === line.itemId);
                if (item) {
                    line.priceListDetails = item.priceListDetails;
                    line.itemName = item.name;
                    line.uomName =
                        line.priceListDetails.find((t) => t.uomId === line.uomId)?.uomName || '';
                }
            }
            response = plainToInstance(GetByIdResponse, response, {
                excludeExtraneousValues: true,
            });
        }
        return response;
    }

    async getStatusSummary() {
        const countStatus = await this.salesOrderRepo
            .createQueryBuilder('s')
            .where('is_deleted = :isDeleted', { isDeleted: false })
            .groupBy('s.status')
            .select(['count(s.status) as count', 's.status as status'])
            .getRawMany<CountStatus>();

        const total = await this.salesOrderRepo.count({ where: { isDeleted: false } });
        const result = new SummaryResponse();
        result.countStatus = countStatus;
        result.total = total;

        return result;
    }
}
