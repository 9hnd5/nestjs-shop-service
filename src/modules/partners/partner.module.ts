import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';

@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [PartnerService],
    controllers: [PartnerController],
})
export class PartnerModule {}
