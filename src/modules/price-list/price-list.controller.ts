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
    Authorize,
    BaseController,
    CoreResponseInterceptor,
    Headers,
    Mediator,
    Permission,
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
    @Authorize(FeatureConst.priceListManagement, Permission.View)
    async getsPaging(@Query() query: Paging) {
        return await this.priceListQueries.getsPaging(
            query.currentPage,
            query.pageSize,
            query.searchText,
            query.viewMode
        );
    }

    @Get(':id')
    @Authorize(FeatureConst.priceListManagement, Permission.View)
    async get(@Param('id') id: number) {
        return await this.priceListQueries.get(id);
    }

    @Get()
    @Authorize(FeatureConst.priceListManagement, Permission.View)
    async gets() {
        return await this.priceListQueries.gets();
    }

    @Post()
    @ApiBody({ type: AddCommand })
    @Authorize(FeatureConst.priceListManagement, Permission.Insert)
    async add(@Body() command: AddCommand) {
        return await this.mediator.send(command);
    }

    @Put(':id')
    @ApiBody({ type: UpdateCommand })
    @Authorize(FeatureConst.priceListManagement, Permission.Update)
    async update(@Param('id') id: number, @Body() command: UpdateCommand) {
        command.id = id;
        return await this.mediator.send(command);
    }
}
