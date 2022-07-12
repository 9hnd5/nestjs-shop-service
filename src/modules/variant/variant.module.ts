import { Variant } from '@modules/shared/models/variant.model';
import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, CQRSModule } from 'be-core';
import { AddCommandHandler, DeleteCommandHandler, UpdateCommandHandler } from './commands';
import { VariantController } from './variant.controller';

@Module({
    imports: [
        CommonModule,
        SharedModule,
        CQRSModule,
        TypeOrmModule.forFeature([Variant]),
    ],
    controllers: [VariantController],
    providers: [AddCommandHandler, UpdateCommandHandler, DeleteCommandHandler],
})
export class VariantModule {}
