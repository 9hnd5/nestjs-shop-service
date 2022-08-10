import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { GetByIdResponse } from '@modules/sales-order/dtos/get-by-id-response.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import SummaryQuery from '@modules/sales-order/dtos/summary-query.dto';
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
        const {
            pageIndex,
            pageSize,
            status,
            searchText,
            salesChannelCode,
            salesmanCode,
            fromDate,
            toDate,
        } = query;
        const condition = this.salesOrderRepo
            .createQueryBuilder('s')
            .where('s.is_deleted = :isDeleted', { isDeleted: false });

        if (fromDate) {
            condition.andWhere('s.posting_date >= :fromDate', {
                fromDate,
            });
        }
        if (toDate) {
            condition.andWhere('s.posting_date <= :toDate', { toDate });
        }
        if (status) {
            condition.andWhere('s.status = :status', { status });
        }
        if (salesChannelCode) {
            condition.andWhere('s.sales_channel_code = :salesChannelCode', { salesChannelCode });
        }
        if (searchText) {
            condition.andWhere(
                new Brackets((qb) => {
                    qb.where('s.code = :searchCode', { searchCode: searchText }).orWhere(
                        's.customer_name like :searchText',
                        { searchText: `%${searchText}%` }
                    );
                })
            );
        }
        if (salesmanCode) {
            condition.andWhere('s.salesman_code= :salesmanCode', { salesmanCode });
        }
        const [dataSource, totalRow] = await condition
            .orderBy({
                's.modified_date': 'DESC',
                's.posting_date': 'DESC',
            })
            .take(pageSize)
            .skip(pageSize * (pageIndex - 1))
            .getManyAndCount();

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
            const itemsWithPrice = await this.salesOrderService.getItemByIds(itemIds, customerId);
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

    async getStatusSummary(query: SummaryQuery) {
        const { salesChannelCode, fromDate, toDate, salesmanCode } = query;
        const condition = this.salesOrderRepo
            .createQueryBuilder('s')
            .where('is_deleted = :isDeleted', { isDeleted: false });

        if (salesChannelCode) {
            condition.andWhere('sales_channel_code = :salesChannelCode', {
                salesChannelCode,
            });
        }
        if (salesmanCode) {
            condition.andWhere('salesman_code = :salesmanCode', {
                salesmanCode,
            });
        }
        if (fromDate) {
            condition.andWhere('posting_date >= :fromDate', { fromDate });
        }
        if (toDate) {
            condition.andWhere('posting_date <= :toDate', { toDate });
        }

        const total = await condition.getCount();
        const countStatus = await condition
            .groupBy('s.status')
            .select(['count(s.status) as count', 's.status as status'])
            .getRawMany<CountStatus>();

        const result = new SummaryResponse();
        result.countStatus = countStatus;
        result.total = total;

        return condition.getQueryAndParameters();
    }
}
