import { FeatureConst } from '@constants/feature.const';
import { Controller, Get, Query } from '@nestjs/common';
import { BaseController, LocalAuthorize, Permission } from 'be-core';
import { GetQuery } from './dtos/get-query.dto';
import { GetSalesInformation } from './dtos/get-sales-information.dto';
import { SalesInformationQuery } from './sales-information.query';

@Controller('sales-information')
export class SalesInformationController extends BaseController {
    constructor(private salesInformationQuery: SalesInformationQuery) {
        super();
    }

    @Get()
    @LocalAuthorize(FeatureConst.orderManagement, Permission.View)
    async get(@Query() query: GetQuery) {
        const revenueData = await this.salesInformationQuery.getRevenueData(query);

        const orderCountData = await this.salesInformationQuery.getOrderCountData(query);

        const volumnData = await this.salesInformationQuery.getVolumeData(query);

        const actualVolumnData = await this.salesInformationQuery.getActualVolumeData(query);

        const salesInformation: GetSalesInformation = {
            SalesRevenue: revenueData[0].SalesRevenue,
            ActualSalesRevenue: revenueData[0].ActualSalesRevenue,
            OrdersCount: orderCountData[0].ordersCount,
            OrdersDeliveredCount: orderCountData[0].ordersDeliveredCount,
            SalesVolume: volumnData
                .map((item) => item.quantity)
                .reduce((prev, next) => prev + next, 0),
            ActualSalesVolume: actualVolumnData
                .map((item) => item.quantity)
                .reduce((prev, next) => prev + next, 0),
        };

        return salesInformation;
    }
}
