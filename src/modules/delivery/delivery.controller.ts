import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetListPartnerQuery } from './dtos/get-list-partner-query.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) {}

    @Get('partners/available')
    getAvailablePartners(@Query() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }

    @Get('partners')
    getListPartner(
        @Query('skip', ParseIntPipe) skip: number,
        @Query('take', ParseIntPipe) take: number
    ) {
        return this.deliveryService.getListPartner(skip, take);
    }

    @Get(':partnerCode')
    getPartnerPrice(
        @Param('partnerCode') partnerCode: string,
        @Query() query: GetListPartnerQuery
    ) {
        return this.deliveryService.getPartnerPrice(partnerCode, query);
    }
}
