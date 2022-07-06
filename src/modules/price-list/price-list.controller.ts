import { Body, Controller, Delete, Get, Injectable, Post, Put, Scope, UseInterceptors, Param, Inject, Query } from "@nestjs/common";
import { AddCommand, UpdateCommand } from "./commands";
import { ApiBody, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { REQUEST } from "@nestjs/core";
import { Authorization, BaseController, BusinessException, CoreResponseInterceptor, Mediator, Permissions, Headers } from "be-core";
import { PriceListQueries } from "@modules/shared/queries/price-list.queries";
import { PagingQuery, PriceListPagingQuery } from "@modules/shared/queries";

// <access modifier, optional>/<service name>/<version>/<controller>/<action>
@Controller('/shop/v1/price-list')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
@ApiTags('Price List')
@Headers()
export class PriceListController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private priceListQueries: PriceListQueries
    ) {
        super(httpRequest)
    }

    // ExpressJs prioritize any well defined routes
    @Get('paging')
    @ApiQuery({ name: 'currentPage', type: Number })
    @ApiQuery({ name: 'pageSize', type: Number })
    @ApiQuery({ name: 'searchText', type: String, required: false })
    @ApiQuery({ name: 'viewMode', type: Number })
    @Authorization('priceListManagement', Permissions.View, true)
    async getsPaging(
        @Query() query: PriceListPagingQuery,
    ) {
        return await this.priceListQueries.getsPaging(query._currentPage, query._pageSize, query.searchText, query._viewMode);
    }   

    @Get(':id')
    @ApiParam({ name: 'id', type: Number })
    @Authorization('priceListManagement', Permissions.View, true)
    async get(@Param('id') id: number) {
        return await this.priceListQueries.get(id);
    }

    @Get()
    @Authorization('priceListManagement', Permissions.View, true)
    async gets() {
        return await this.priceListQueries.gets();
    }

    @Post()
    @ApiBody({ type: AddCommand })
    @Authorization('priceListManagement', Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return await this.mediator.send(command);
    }

    @Put()
    @ApiBody({ type: UpdateCommand })
    @Authorization('priceListManagement', Permissions.Update, true)
    async update(@Body() command: UpdateCommand) {
        return await this.mediator.send(command);
    }
}