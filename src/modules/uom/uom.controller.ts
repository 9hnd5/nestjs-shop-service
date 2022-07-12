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
    Authorize,
    BaseController,
    CoreResponseInterceptor,
    Mediator,
    Permission,
} from 'be-core';
import { AddCommand, DeleteCommand, UpdateCommand } from './commands';

@Controller('/shop/v1/uom')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
export class UomController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private uomQueries: UomQueries,
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorize(FeatureConst.uomManagement, Permission.All)
    async getsPaging(@Query() param: Paging) {
        return this.uomQueries.getsPaging(param);
    }

    @Get(':id')
    @Authorize(FeatureConst.uomManagement, Permission.View)
    async get(@Param('id') id: number) {
        return this.uomQueries.get(id);
    }

    @Get('')
    @Authorize(FeatureConst.uomManagement, Permission.View)
    async gets() {
        return this.uomQueries.gets();
    }

    @Post('')
    @Authorize(FeatureConst.uomManagement, Permission.Insert)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorize(FeatureConst.uomManagement, Permission.Update)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorize(FeatureConst.uomManagement, Permission.Delete)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}
