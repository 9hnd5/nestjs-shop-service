import { Controller, Get, Query, Param } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';

@Controller('partners')
export class PartnerController {
    constructor(private partnerService: PartnerService) {}


    @Get(':code')
    getByCode(@Param('code') code: string) {
        return this.partnerService.getByCode(code);
    }

    @Get('')
    gets() {
        return this.partnerService.gets();
    }
}
