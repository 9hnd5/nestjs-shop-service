import { GetOrderdData } from './dtos/get-orders-data.dto';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { GetQuery } from './dtos/get-query.dto';
import { GetRevenue } from './dtos/get-revenue.dto';
import { GetOrderCount } from './dtos/get-order-count.dto';
import { GetVolume } from './dtos/get-volumn.dto';
import { SalesInformationService } from './sales-information.service';
import SalesOrderRepo from './sales-order.repo';
import { format } from 'date-fns';
import { GetBySalesMans } from './dtos/get-by-salesman.dto';

@Injectable()
export class SalesInformationQuery {
    static salesOrderRepo: any;
    constructor(
        private salesOrderRepo: SalesOrderRepo,
        private salesInformationService: SalesInformationService,
        private ds: DataSource
    ) {}

    async getRevenueData(query: GetQuery) {
        const { salesmanCodes, itemIds, fromDate, toDate } = query;

        //Format salesmanCodes
        const salesmanArr = salesmanCodes.split(',');
        const salesmanCodesFormat = salesmanArr.map((word) => `'${word.trim()}'`).join(',');

        //parse Date to date string format yyyymmdd
        const fromdateStr = format(fromDate, 'yyyyMMdd');
        const toDateStr = format(toDate, 'yyyyMMdd');

        //Get Revenue
        const queryStr = this.getRevenueQuery(salesmanCodesFormat, itemIds, fromdateStr, toDateStr);
        const queryResult = await this.ds.manager.query(queryStr);

        const revenueData = plainToInstance(GetRevenue, queryResult as GetRevenue[], {
            excludeExtraneousValues: true,
        });
        return revenueData;
    }

    getRevenueQuery(
        salesmanCodesFormat: string,
        itemIds: string,
        fromdateStr: string,
        toDateStr: string
    ) {
        //Build query string
        const saleRevenueQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('SUM(sol.line_total)', 'SalesRevenue')
            .addSelect('0', 'ActualSalesRevenue')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        const actualSaleRevenueQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('0', 'SalesRevenue')
            .addSelect('SUM(sol.line_total)', 'ActualSalesRevenue')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere("so.status IN ('OrderPreparation', 'WaitingDelivery', 'Delivered')") //For actual
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        const queryStr = `
            SELECT
                SUM(Temp.SalesRevenue) AS 'SalesRevenue',
                SUM(Temp.ActualSalesRevenue) AS 'ActualSalesRevenue' 
            FROM(
                ${saleRevenueQuery.getQuery()} UNION ${actualSaleRevenueQuery.getQuery()}
            ) Temp;
            `;
        return queryStr;
    }

    async getVolumeData(query: GetQuery) {
        const { salesmanCodes, itemIds, fromDate, toDate } = query;

        //Format salesmanCodes
        const salesmanArr = salesmanCodes.split(',');
        const salesmanCodesFormat = salesmanArr.map((word) => `'${word.trim()}'`).join(',');

        //parse Date to date string format yyyymmdd
        const fromdateStr = format(fromDate, 'yyyyMMdd');
        const toDateStr = format(toDate, 'yyyyMMdd');

        //Get Volume
        const queryStr = this.getVolumeQuery(salesmanCodesFormat, itemIds, fromdateStr, toDateStr);
        const queryResult = await this.ds.manager.query(queryStr);

        const volumnData = plainToInstance(GetVolume, queryResult as GetVolume[], {
            excludeExtraneousValues: true,
        });

        //Get UoM definition for base quantity
        const arrids = itemIds.split(',').map(Number);
        const itemUoMs = await this.salesInformationService.getItemUoMByIds(arrids);
        if (itemUoMs.length > 0) {
            for (const line of volumnData) {
                const itemUoM = itemUoMs.find(
                    (x) => x.itemId === line.itemId && x.altUomId === line.uomId
                );

                if (itemUoM !== null) {
                    line.quantity = (itemUoM?.baseQuantity ?? 0) * line.quantity;
                }
            }
        }

        return volumnData;
    }

    getVolumeQuery(
        salesmanCodesFormat: string,
        itemIds: string,
        fromdateStr: string,
        toDateStr: string
    ) {
        //Build query string
        const salesVolumeQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('so.id', 'orderId')
            .addSelect('sol.item_id', 'itemId')
            .addSelect('sol.uom_id', 'uomId')
            .addSelect('sol.quantity', 'quantity')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        return salesVolumeQuery.getQuery();
    }

    async getActualVolumeData(query: GetQuery) {
        const { salesmanCodes, itemIds, fromDate, toDate } = query;

        //Format salesmanCodes
        const salesmanArr = salesmanCodes.split(',');
        const salesmanCodesFormat = salesmanArr.map((word) => `'${word.trim()}'`).join(',');

        //parse UTC Date to date string format yyyymmdd
        const fromdateStr = format(fromDate, 'yyyyMMdd');
        const toDateStr = format(toDate, 'yyyyMMdd');

        //Get Actual Volume
        const queryStr = this.getActualVolumeQuery(
            salesmanCodesFormat,
            itemIds,
            fromdateStr,
            toDateStr
        );
        const queryResult = await this.ds.manager.query(queryStr);
        const volumnData = plainToInstance(GetVolume, queryResult as GetVolume[], {
            excludeExtraneousValues: true,
        });

        //Get UoM definition for base quantity
        const arrids = itemIds.split(',').map(Number);
        const itemUoMs = await this.salesInformationService.getItemUoMByIds(arrids);
        if (itemUoMs.length > 0) {
            for (const line of volumnData) {
                const itemUoM = itemUoMs.find(
                    (x) => x.itemId === line.itemId && x.altUomId === line.uomId
                );

                if (itemUoM !== null) {
                    line.quantity = (itemUoM?.baseQuantity ?? 0) * line.quantity;
                }
            }
        }

        return volumnData;
    }

    getActualVolumeQuery(
        salesmanCodesFormat: string,
        itemIds: string,
        fromdateStr: string,
        toDateStr: string
    ) {
        //Build query string
        const salesVolumeQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('so.id', 'orderId')
            .addSelect('sol.item_id', 'itemId')
            .addSelect('sol.uom_id', 'uomId')
            .addSelect('sol.quantity', 'quantity')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere("so.status IN ('OrderPreparation', 'WaitingDelivery', 'Delivered')") //For actual
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        return salesVolumeQuery.getQuery();
    }

    async getOrderCountData(query: GetQuery) {
        const { salesmanCodes, itemIds, fromDate, toDate } = query;

        //Format salesmanCodes
        const salesmanArr = salesmanCodes.split(',');
        const salesmanCodesFormat = salesmanArr.map((word) => `'${word.trim()}'`).join(',');

        //parse Date to date string format yyyymmdd
        const fromdateStr = format(fromDate, 'yyyyMMdd');
        const toDateStr = format(toDate, 'yyyyMMdd');

        //Get orderCount
        const queryStr = this.getOrderCountQuery(
            salesmanCodesFormat,
            itemIds,
            fromdateStr,
            toDateStr
        );
        const queryResult = await this.ds.manager.query(queryStr);

        const orderCountData = plainToInstance(GetOrderCount, queryResult as GetOrderCount[], {
            excludeExtraneousValues: true,
        });
        return orderCountData;
    }

    getOrderCountQuery(
        salesmanCodesFormat: string,
        itemIds: string,
        fromdateStr: string,
        toDateStr: string
    ) {
        //Build query string
        const ordersCountQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('COUNT(so.id)', 'ordersCount')
            .addSelect('0', 'ordersDeliveredCount')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        const ordersDeliveredCountQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('0', 'ordersCount')
            .addSelect('COUNT(so.id)', 'ordersDeliveredCount')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere("so.status IN ('Delivered')")
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`sol.item_id IN (${itemIds})`)
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`);

        const queryStr = `
            SELECT
                *
            FROM(
                ${ordersCountQuery.getQuery()} UNION ${ordersDeliveredCountQuery.getQuery()}
            ) Temp;
            `;
        return queryStr;
    }

    async getOrdersData(query: GetBySalesMans) {
        const { salesmanCodes, fromDate, toDate } = query;

        //Format salesmanCodes
        const salesmanArr = salesmanCodes.split(',');
        const salesmanCodesFormat = salesmanArr.map((word) => `'${word.trim()}'`).join(',');

        //parse Date to date string format yyyymmdd
        const fromdateStr = format(fromDate, 'yyyyMMdd');
        const toDateStr = format(toDate, 'yyyyMMdd');

        //Get orderCount
        const queryStr = this.getOrdersQuery(salesmanCodesFormat, fromdateStr, toDateStr);
        const queryResult = await this.ds.manager.query(queryStr);

        const orderCountData = plainToInstance(GetOrderdData, queryResult as GetOrderdData[], {
            excludeExtraneousValues: true,
        });
        return orderCountData;
    }

    getOrdersQuery(salesmanCodesFormat: string, fromdateStr: string, toDateStr: string) {
        //Build query string
        const ordersQuery = this.salesOrderRepo.repository
            .createQueryBuilder('so')
            .select('so.id', 'OrderId')
            .addSelect('so.status', 'Status')
            .addSelect('so.salesman_code', 'SalesmanCode')
            .addSelect('so.`total_before_discount`', 'TotalBeforeDiscount')
            .addSelect('sol.item_id', 'ItemId')
            .addSelect('sol.uom_id', 'UomId')
            .addSelect('sol.quantity', 'Quantity')
            .addSelect('sol.line_total', 'LineTotal')
            .innerJoin('so.items', 'sol')
            .where('so.is_deleted = 0')
            .andWhere('sol.is_deleted = 0')
            .andWhere(`so.salesman_code IN (${salesmanCodesFormat})`)
            .andWhere(`so.posting_date BETWEEN  ${fromdateStr} AND ${toDateStr}`)
            .getQuery();

        return ordersQuery;
    }
}
