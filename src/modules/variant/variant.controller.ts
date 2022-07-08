import { FeatureConst } from '@constants/feature.const';
import { Paging } from '@modules/shared/queries';
import { VariantQueries } from '@modules/shared/queries/variant.queries';
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

@Controller('/shop/v1/variant')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
export class VariantController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private variantQueries: VariantQueries
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorization(FeatureConst.variantManagement, Permissions.View, true)
    async getsPaging(@Query() param: Paging) {
        return this.variantQueries.getsPaging(param);
    }

    @Get(':id')
    @Authorization(FeatureConst.variantManagement, Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.variantQueries.get(id);
    }

    @Get('')
    @Authorization(FeatureConst.variantManagement, Permissions.View, true)
    async gets() {
        return this.variantQueries.gets();
    }

    @Post('')
    @Authorization(FeatureConst.variantManagement, Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorization(FeatureConst.variantManagement, Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorization(FeatureConst.variantManagement, Permissions.Delete, true)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}
