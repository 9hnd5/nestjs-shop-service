import { Controller, Get, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) {}

    @Get('partners/available')
    getAvailablePartners(@Query() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }
}
