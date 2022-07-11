import { FeatureConst } from '@constants/feature.const';
import { Paging } from '@modules/shared/queries';
import { ProductCategoryQueries } from '@modules/shared/queries/product-category.queries';
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
import { ApiTags } from '@nestjs/swagger';
import {
    Authorization,
    BaseController,
    CoreResponseInterceptor,
    Mediator,
    Permissions,
} from 'be-core';
import { AddCommand, DeleteCommand, UpdateCommand } from './commands';

@Controller('/shop/v1/product-category')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
@ApiTags('Product Category')
export class ProductCategoryController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private productCategoryQueries: ProductCategoryQueries
    ) {
        super(httpRequest);
    }

    @Get('paging')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.View, true)
    async getsPaging(@Query() param: Paging) {
        return this.productCategoryQueries.getsPaging(param);
    }

    @Get(':id')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.productCategoryQueries.get(id);
    }

    @Get('')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.View, true)
    async gets() {
        return this.productCategoryQueries.gets();
    }

    @Post('')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put(':id')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return this.mediator.send(command);
    }

    @Delete(':id')
    @Authorization(FeatureConst.productCategoryManagement, Permissions.Delete, true)
    async delete(@Param('id') id: number) {
        const command = new DeleteCommand();
        command.id = id;
        return this.mediator.send(command);
    }
}
