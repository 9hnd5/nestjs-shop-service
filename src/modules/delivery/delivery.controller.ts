import { Body, Controller, Post } from '@nestjs/common';
import { Mediator } from 'be-core';
import { DeliveryService } from './delivery.service';
import { GetAvailablePartnersQuery } from './dtos';

@Controller('deliveries')
export class DeliveryController {
    constructor(private mediator: Mediator, private deliveryService: DeliveryService) {}
    @Post('partners/available')
    getAvailablePartners(@Body() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }
}
