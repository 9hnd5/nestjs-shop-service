import { FeatureConst } from '@constants/.';
import { Paging } from '@modules/shared/queries';
import { PriceListQueries } from '@modules/shared/queries/price-list.queries';
import {
    Body,
    Controller,
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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
    Authorization,
    BaseController,
    CoreResponseInterceptor,
    Headers,
    Mediator,
    Permissions,
} from 'be-core';
import { AddCommand, UpdateCommand } from './commands';

// <access modifier, optional>/<service name>/<version>/<controller>/<action>
@Controller('/shop/v1/price-lists')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
@ApiTags('Price List')
@Headers()
export class PriceListController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private priceListQueries: PriceListQueries
    ) {
        super(httpRequest);
    }

    // ExpressJs prioritize any well defined routes
    @Get('paging')
    @Authorization(FeatureConst.priceListManagement, Permissions.View, true)
    async getsPaging(@Query() query: Paging) {
        return await this.priceListQueries.getsPaging(
            query.currentPage,
            query.pageSize,
            query.searchText,
            query.viewMode
        );
    }

    @Get(':id')
    @Authorization(FeatureConst.priceListManagement, Permissions.View, true)
    async get(@Param('id') id: number) {
        return await this.priceListQueries.get(id);
    }

    @Get()
    @Authorization(FeatureConst.priceListManagement, Permissions.View, true)
    async gets() {
        return await this.priceListQueries.gets();
    }

    @Post()
    @ApiBody({ type: AddCommand })
    @Authorization(FeatureConst.priceListManagement, Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return await this.mediator.send(command);
    }

    @Put(':id')
    @ApiBody({ type: UpdateCommand })
    @Authorization(FeatureConst.priceListManagement, Permissions.Update, true)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return await this.mediator.send(command);
    }
}
