import { Paging } from "@modules/shared/queries";
import { UomQueries } from "@modules/shared/queries/uom.queries";
import { Body, Controller, Delete, Get, Inject, Injectable, Param, Post, Put, Query, Scope, UseInterceptors } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Authorization, BaseController, CoreResponseInterceptor, Mediator, Permissions } from "be-core";
import { AddCommand, DeleteCommand, UpdateCommand } from "./commands";

@Controller('/shop/v1/uom')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
export class UomController extends BaseController {

    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private uomQueries: UomQueries
    ) {
        super(httpRequest)
    }

    @Get('pagings')
    @Authorization('uomManagement', Permissions.View, true)
    async getPagings(@Query() param: Paging) {
        return this.uomQueries.getPagings(param)
    }

    @Get(':id')
    @Authorization('uomManagement', Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.uomQueries.get(id)
    }

    @Get('')
    @Authorization('uomManagement', Permissions.View, true)
    async gets() {
        return this.uomQueries.gets()
    }

    @Post('')
    @Authorization('uomManagement', Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorization('uomManagement', Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorization('uomManagement', Permissions.Delete, true)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}

