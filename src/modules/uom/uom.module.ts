import { Uom } from '@modules/shared/models/uom.model';
import { SharedModule } from '@modules/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule, CQRSModule, ScopeVariableModule } from 'be-core';
import { AddCommandHandler, DeleteCommandHandler, UpdateCommandHandler } from './commands';
import { UomController } from './uom.controller';

@Module({
    imports: [
        ScopeVariableModule,
        CommonModule,
        SharedModule,
        CQRSModule,
        TypeOrmModule.forFeature([Uom])
    ],
  controllers: [UomController],
  providers: [
      AddCommandHandler,
      UpdateCommandHandler,
      DeleteCommandHandler
  ]
})
export class UomModule {}
