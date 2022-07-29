import { SalesOrderSchema } from '@modules/sales-order/config/sales-order.config';
import { GetByIdResponse } from '@modules/sales-order/dtos/get-by-id-response.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import { SummaryQuery } from '@modules/sales-order/dtos/summary-query.dto';
import { SummaryResponse } from '@modules/sales-order/dtos/summary-response.dto';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { Injectable } from '@nestjs/common';
import { HttpService, Paginated } from 'be-core';
import { plainToInstance } from 'class-transformer';
import { Brackets, DataSource, Repository } from 'typeorm';
import { get as getConfig } from '../../config';

const externalServiceConfig = getConfig('externalService');

@Injectable()
export class SalesOrderQuery {
    private salesOrderRepo: Repository<SalesOrder>;
    constructor(dataSource: DataSource, private httpClient: HttpService) {
        this.salesOrderRepo = dataSource.getRepository<SalesOrder>(SalesOrderSchema);
    }

    async get(query: GetQuery) {
        const { pageIndex, pageSize, status, searchText, salesChannel, fromDate, toDate } = query;
        // Get Orders for a week if no date query values are presented
        const now = new Date();
        const aWeekBefore = new Date();
        aWeekBefore.setDate(aWeekBefore.getDate() - 7);

        let cond = this.salesOrderRepo
            .createQueryBuilder('s')
            .where('is_deleted = :isDeleted', { isDeleted: false })
            .andWhere('s.created_date >= :fromDate', {
                fromDate: (fromDate ?? aWeekBefore).toISOString(),
            })
            .andWhere('s.created_date < :toDate', { toDate: (toDate ?? now).toISOString() })
            .take(pageSize)
            .skip(pageSize * (pageIndex - 1));

        if (status) {
            cond = cond.andWhere('s.status = :status', { status });
        }
        if (salesChannel) {
            cond = cond.andWhere('s.sales_channel = :salesChannel', { salesChannel });
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
        const response = plainToInstance(GetByIdResponse, salesOrder, {
            excludeExtraneousValues: true,
        });
        if (salesOrder) {
            const paymentMethodRs = await this.httpClient.get(
                `payment/v1/payment-methods/${salesOrder.paymentMethodId}`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.paymentUrl,
                    },
                }
            );
            response.paymentMethod = paymentMethodRs.data
                ? paymentMethodRs.data.paymentMethodName
                : undefined;
        }

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
