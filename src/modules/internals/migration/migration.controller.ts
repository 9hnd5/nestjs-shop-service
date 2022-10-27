import { Body, Controller, Post } from '@nestjs/common';
import { MigrationService as CoreMigrationService } from 'be-core';
@Controller('/internal/shop/v1/migrations')
export class MigrationController {
    constructor(private service: CoreMigrationService) {}

    @Post()
    addMigration(@Body() data: { tenantCode: string }) {
        return this.service.addMigration(data);
    }
}
