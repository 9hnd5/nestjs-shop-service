import { Controller, Get, Param } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Controller('partners')
export class PartnerController {
    constructor(private partnerService: PartnerService) {}

    @Get(':code')
    getByCode(@Param('code') code: string) {
        return this.partnerService.getByCode(code);
    }
}
