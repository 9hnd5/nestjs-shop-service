import { GetByIdResponse } from '@modules/sales-order/dtos/get-by-id-response.dto';
import { GetQuery } from '@modules/sales-order/dtos/get-query.dto';
import { GetResponse } from '@modules/sales-order/dtos/get-response.dto';
import SummaryQuery from '@modules/sales-order/dtos/summary-query.dto';
import {
    OrderStatus,
    PaymentStatus,
    SummaryResponse,
} from '@modules/sales-order/dtos/summary-response.dto';
import SalesOrderRepo from '@modules/sales-order/sales-order.repo';
import { SalesOrderService } from '@modules/sales-order/sales-order.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Paginated } from 'be-core';
import { plainToInstance } from 'class-transformer';
import { Brackets } from 'typeorm';

@Injectable()
export class SalesOrderQuery {
    constructor(
        private salesOrderRepo: SalesOrderRepo,
        private salesOrderService: SalesOrderService
    ) {}

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
            paymentStatus,
        } = query;
        const condition = this.salesOrderRepo.repository
            .createQueryBuilder('s')
            .where('s.is_deleted = :isDeleted', { isDeleted: false });

        if (paymentStatus) {
            condition.andWhere('s.payment_status = :paymentStatus', { paymentStatus });
        }

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

        condition.orderBy('s.modified_date', 'DESC').addOrderBy('s.created_date', 'DESC');

        const [dataSource, totalRow] = await condition
            .orderBy('s.modified_date', 'DESC')
            .addOrderBy('s.created_date', 'DESC')
            .skip(pageSize * (pageIndex - 1))
            .take(pageSize)
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
        const salesOrder = await this.salesOrderRepo.repository.findOne({
            where: { id, isDeleted: false },
            relations: { items: true },
        });
        if (!salesOrder) {
            throw new NotFoundException('Not Found');
        }
        let response = plainToInstance(GetByIdResponse, salesOrder.entity, {
            excludeExtraneousValues: true,
        });
        if (salesOrder && salesOrder.items.length > 0) {
            const itemIds = salesOrder.items.map((t) => t.itemId);
            const customerId = salesOrder.entity.customerId ?? 0;
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
        const { salesChannelCode, fromDate, toDate, salesmanCode, orderStatus } = query;
        const condition = this.salesOrderRepo.repository
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

        const totalCount = await condition.getCount();
        const orderStatuses = await condition
            .groupBy('s.status')
            .select(['count(s.status) as count', 's.status as status'])
            .getRawMany<OrderStatus>();

        if (orderStatus) {
            condition.andWhere('status = :orderStatus', {
                orderStatus,
            });
        }

        const paymentStatuses = (
            await condition
                .groupBy('s.paymentStatus')
                .select(['count(s.paymentStatus) as count', 's.paymentStatus as status'])
                .getRawMany<PaymentStatus>()
        ).filter((x) => x.status !== null);

        const result = new SummaryResponse();
        result.orderStatuses = orderStatuses;
        result.paymentStatuses = paymentStatuses;
        result.totalCount = totalCount;

        return result;
    }
}
