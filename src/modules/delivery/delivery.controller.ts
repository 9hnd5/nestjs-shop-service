import { Controller, Get, Query } from '@nestjs/common';
import { Mediator } from 'be-core';
import { DeliveryService } from './delivery.service';
import { DeliveryLocationQuery } from './dtos/get-available-partners-query.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private mediator: Mediator, private deliveryService: DeliveryService) {}
    @Get('partners/available')
    getAvailablePartners(@Query() query: DeliveryLocationQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }
}
