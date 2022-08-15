import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { Module } from '@nestjs/common';
import { CQRSModule, HttpModule } from 'be-core';

@Module({
    imports: [CQRSModule, HttpModule.register({})],
    providers: [DeliveryService],
    controllers: [DeliveryController],
})
export class DeliveryModule {}
