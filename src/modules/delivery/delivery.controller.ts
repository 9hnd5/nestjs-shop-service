import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AddDocument } from './dtos/add-document.dto';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetPartnerPricesQuery } from './dtos/get-partner-prices-query.dto';
import { GetPartnersQuery } from './dtos/get-partners-query.dto';
import { UpdateDocument } from './dtos/update-document.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) {}

    @Get('partners/available')
    getAvailablePartners(@Query() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }

    @Get('partners')
    getPartners(@Query() query: GetPartnersQuery) {
        return this.deliveryService.getPartners(query);
    }

    @Get(':partnerCode')
    getPartnerPrices(
        @Param('partnerCode') partnerCode: string,
        @Query() query: GetPartnerPricesQuery
    ) {
        return this.deliveryService.getPartnerPrices(partnerCode, query);
    }

    @Post()
    add(@Body() command: AddDocument) {
        return this.deliveryService.addDocument(command);
    }

    @Post(':code')
    confirm(@Param('code') code: string) {
        return this.deliveryService.confirmedDocument(code);
    }

    @Put(':code')
    cancel(@Param('code') code: string) {
        return this.deliveryService.cancelDocument(code);
    }

    @Patch(':code')
    update(@Param('code') code: string, @Body() command: UpdateDocument) {
        return this.deliveryService.updateDocument(code, command);
    }
}
