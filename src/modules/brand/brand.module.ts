import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CQRSModule } from 'be-core';
import { BrandModel } from './../shared/models/brand.model';
import { BrandController } from './brand.controller';
import { AddCommandHandler, UpdateCommandHandler } from './commands';

@Module({
    imports: [SharedModule, CQRSModule, TypeOrmModule.forFeature([BrandModel])],
    controllers: [BrandController],
    providers: [AddCommandHandler, UpdateCommandHandler],
})
export class BrandModule {}
