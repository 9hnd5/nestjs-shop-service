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
import { BaseController, CoreResponseInterceptor, Mediator, Authorize, Permission } from 'be-core';
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
    @Authorize(FeatureConst.variantManagement, Permission.View)
    async getsPaging(@Query() param: Paging) {
        return this.variantQueries.getsPaging(param);
    }

    @Get(':id')
    @Authorize(FeatureConst.variantManagement, Permission.View)
    async get(@Param('id') id: number) {
        return this.variantQueries.get(id);
    }

    @Get('')
    @Authorize(FeatureConst.variantManagement, Permission.View)
    async gets() {
        return this.variantQueries.gets();
    }

    @Post('')
    @Authorize(FeatureConst.variantManagement, Permission.Insert)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorize(FeatureConst.variantManagement, Permission.Update)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorize(FeatureConst.variantManagement, Permission.Delete)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}
