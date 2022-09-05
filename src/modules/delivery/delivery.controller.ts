import { Controller, Get, Query, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetPartnerPricesQuery } from './dtos/get-partner-prices-query.dto';
import { GetPartnersQuery } from './dtos/get-partners-query.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) {}

    @Get('partners/available')
    getAvailablePartners(@Query() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }

    @Get('partners')
    getListPartner(@Query() query: GetPartnersQuery) {
        return this.deliveryService.getPartners(query);
    }

    @Get(':partnerCode')
    getPartnerPrices(
        @Param('partnerCode') partnerCode: string,
        @Query() query: GetPartnerPricesQuery
    ) {
        return this.deliveryService.getPartnerPrices(partnerCode, query);
    }
}
