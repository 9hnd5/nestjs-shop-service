import { Body, Controller, Delete, Get, Injectable, Post, Put, Scope, UseInterceptors, Param, Inject, Query } from "@nestjs/common";
import { AddCommand, DeleteCommand, UpdateCommand } from "./commands";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { REQUEST } from "@nestjs/core";
import { Authorization, BaseController, CoreResponseInterceptor, Mediator, Permissions, Headers } from "be-core";
import { UomQueries } from "@modules/shared/queries/uom.queries";
import { Paging } from "@modules/shared/queries";


@Controller('/core/v1/uom')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
@ApiTags('Uom')
@Headers()
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
    @ApiParam({ name: 'id', type: Number })
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
    @ApiBody({ type: AddCommand })
    @Authorization('uomManagement', Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put('')
    @ApiBody({ type: UpdateCommand })
    @Authorization('uomManagement', Permissions.Update, true)
    async update(@Body() command: UpdateCommand) {
        return this.mediator.send(command);
    }

    @Delete('')
    @ApiBody({ type: DeleteCommand })
    @Authorization('uomManagement', Permissions.Delete)
    async delete(@Body() command: DeleteCommand) {
        return this.mediator.send(command);
    }
}

