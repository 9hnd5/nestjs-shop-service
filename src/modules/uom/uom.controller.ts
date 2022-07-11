import { FeatureConst } from '@constants/feature.const';
import { Paging } from '@modules/shared/queries';
import { UomQueries } from '@modules/shared/queries/uom.queries';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Injectable,
    Param,
    Post,
    Put,
    Query,
    Scope,
    UseInterceptors,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
    Authorization,
    BaseController,
    CoreResponseInterceptor,
    Mediator,
    Permissions,
} from 'be-core';
import { AddCommand, DeleteCommand, UpdateCommand } from './commands';

@Controller('/shop/v1/uom')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
export class UomController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private uomQueries: UomQueries
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorization(FeatureConst.uomManagement, Permissions.View, true)
    async getsPaging(@Query() param: Paging) {
        return this.uomQueries.getsPaging(param);
    }

    @Get(':id')
    @Authorization(FeatureConst.uomManagement, Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.uomQueries.get(id);
    }

    @Get('')
    @Authorization(FeatureConst.uomManagement, Permissions.View, true)
    async gets() {
        return this.uomQueries.gets();
    }

    @Post('')
    @Authorization(FeatureConst.uomManagement, Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorization(FeatureConst.uomManagement, Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorization(FeatureConst.uomManagement, Permissions.Delete, true)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}
