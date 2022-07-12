import { BrandQueries, PagingQuery } from '@modules/shared/queries/brand.queries';
import { Body, Controller, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Authorize, BaseController, Mediator, Permission } from 'be-core';
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
    @Authorize('brandManagement', Permission.View)
    async getsPaging(@Query() filter: PagingQuery) {
        return this.brandQueries.getsPaging(filter);
    }

    @Get(':id')
    @Authorize('brandManagement', Permission.View)
    async get(@Param('id') id: number) {
        return this.brandQueries.get(id);
    }

    @Get()
    @Authorize('brandManagement', Permission.View)
    async getAll() {
        return this.brandQueries.gets();
    }

    @Post()
    @Authorize('brandManagement', Permission.Insert)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorize('brandManagement', Permission.Update)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }
}
