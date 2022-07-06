import { Uom } from '@modules/shared/models/uom.model'
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core'
import { UomQueries } from "@modules/shared/queries/uom.queries";
import { UomRepository } from "@modules/shared/repositories/uom.repository";
import {IsEmpty, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCommand extends BaseCommand<Uom> {

    @IsNotEmpty()
    @ApiProperty()
    public id: number;

    @IsNotEmpty()
    @ApiProperty()
    public code: string;

    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    public description: string;

    @ApiProperty()
    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, Uom> {
    constructor(private uomRepository: UomRepository, private uomQueries: UomQueries) { 
        super()
    }

    public async apply(command: UpdateCommand): Promise<Uom> {

        let uom = await this.uomQueries.get(command.id);

        if (!uom) {
            throw new BusinessException('Dữ liệu không tồn tại')
        }
        uom.name = command.name;
        uom.description = command.description;
        uom.status = command.status;
        uom = await this.updateBuild(uom, command.session);
        return await this.uomRepository.update(uom);
    }
}