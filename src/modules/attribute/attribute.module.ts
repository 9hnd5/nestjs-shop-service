import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, CQRSModule } from 'be-core';
import { AttributeModel } from './../shared/models/attribute.model';
import { AttributeController } from './attribute.controller';
import { AddCommandHandler, UpdateCommandHandler } from './commands';

@Module({
    imports: [
        CommonModule,
        SharedModule,
        CQRSModule,
        TypeOrmModule.forFeature([AttributeModel]),
    ],
    controllers: [AttributeController],
    providers: [AddCommandHandler, UpdateCommandHandler],
})
export class AttributeModule {}
