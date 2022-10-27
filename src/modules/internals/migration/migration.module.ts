import { MigrationController } from '@modules/internals/migration/migration.controller';
import { Module } from '@nestjs/common';
import { MigrationModule as CoreMigrationModule } from 'be-core';
import * as path from 'path';

@Module({
    imports: [
        CoreMigrationModule.register({
            migrationDir: path.resolve(__dirname, '../../../', 'migrations/*.{ts,js}'),
        }),
    ],
    controllers: [MigrationController],
})
export class MigrationModule {}
