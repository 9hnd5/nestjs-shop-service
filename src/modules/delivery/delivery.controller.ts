import { Controller, Get, Query, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetDocumentsQuery } from './dtos/get-document-query.dto';

@Controller('deliveries')
export class DeliveryController {
    constructor(private deliveryService: DeliveryService) {}

    @Get('partners/available')
    getAvailablePartners(@Query() query: GetAvailablePartnersQuery) {
        return this.deliveryService.getAvailablePartners(query);
    }

    @Get(':code')
    getByCode(@Param('code') code: string) {
        return this.deliveryService.getByCode(code);
    }

    @Get(':code/documents/confirmed')
    getDocumentConfirm(@Param('code') code: string, @Query() query: GetDocumentsQuery) {
        return this.deliveryService.getDocumentConfirmed(code, query);
    }

    @Get(':code/documents/canceled')
    getDocumentCancel(@Param('code') code: string, @Query() query: GetDocumentsQuery) {
        return this.deliveryService.getDocumentCanceled(code, query);
    }

    @Get(':code/documents/update')
    getDocumentUpdate(@Param('code') code: string, @Query() query: GetDocumentsQuery) {
        return this.deliveryService.getDocumentUpdate(code, query);
    }
}
