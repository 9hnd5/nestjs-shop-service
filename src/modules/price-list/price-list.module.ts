import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { CQRSModule } from 'be-core';
import { AddCommandHandler, UpdateCommandHandler } from './commands';
import { PriceListController } from './price-list.controller';

@Module({
    imports: [SharedModule, CQRSModule],
    controllers: [PriceListController],
    providers: [AddCommandHandler, UpdateCommandHandler],
})
export class PriceListModule {}
