import { Body, Controller, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Authorize, BaseController, Mediator, Permission } from 'be-core';
import { AttributeQueries, PagingQuery } from './../shared/queries/attribute.queries';
import { AddCommand, UpdateCommand } from './commands';

@Controller('/shop/v1/attributes')
export class AttributeController extends BaseController {
    /**
     *
     */
    constructor(
        @Inject(REQUEST) httpRequest,
        private mediator: Mediator,
        private attributeQueries: AttributeQueries
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorize("attributeManagement", Permission.All)
    getsPaging(@Query() filter: PagingQuery) {
        return this.attributeQueries.getsPaging(filter);
    }

    @Get(':id')
    @Authorize("attributeManagement", Permission.All)
    get(@Param('id') id: number) {
        return this.attributeQueries.get(id);
    }

    @Get()
    @Authorize('attributeManagement', Permission.All)
    getAll() {
        return this.attributeQueries.gets();
    }

    @Post()
    @Authorize("attributeManagement", Permission.All)
    add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorize("attributeManagement", Permission.All)
    update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }
}
