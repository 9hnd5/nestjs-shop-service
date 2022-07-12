import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, CQRSModule, ScopeVariableModule } from 'be-core';
import { BrandModel } from './../shared/models/brand.model';
import { BrandController } from './brand.controller';
import { AddCommandHandler, UpdateCommandHandler } from './commands';

@Module({
    imports: [
        ScopeVariableModule,
        CommonModule,
        SharedModule,
        CQRSModule,
        TypeOrmModule.forFeature([BrandModel]),
    ],
    controllers: [BrandController],
    providers: [AddCommandHandler, UpdateCommandHandler],
})
export class BrandModule {}
