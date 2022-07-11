import { BrandQueries, PagingQuery } from '@modules/shared/queries/brand.queries';
import { Body, Controller, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Authorization, BaseController, Mediator, Permissions } from 'be-core';
import { AddCommand, UpdateCommand } from './commands';

@Controller('/shop/v1/brands')
export class BrandController extends BaseController {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) httpRequest,
        private mediator: Mediator,
        private brandQueries: BrandQueries
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorization('brandManagement', Permissions.View, true)
    async getsPaging(@Query() filter: PagingQuery) {
        return this.brandQueries.getsPaging(filter);
    }

    @Get(':id')
    @Authorization('brandManagement', Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.brandQueries.get(id);
    }

    @Get()
    @Authorization('brandManagement', Permissions.View, true)
    async getAll() {
        return this.brandQueries.gets();
    }

    @Post()
    @Authorization('brandManagement', Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorization('brandManagement', Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }
}
