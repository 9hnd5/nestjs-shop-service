import { ExampleModel } from '@modules/shared/models/example.model';
import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CQRSModule } from 'be-core';
import { AddCommandHandler, DeleteCommandHandler, UpdateCommandHandler } from './commands';
import { ExampleController } from './example.controller';

@Module({
    imports: [SharedModule, CQRSModule, TypeOrmModule.forFeature([ExampleModel])],
    controllers: [ExampleController],
    providers: [AddCommandHandler, UpdateCommandHandler, DeleteCommandHandler],
})
export class ExampleModule {}
