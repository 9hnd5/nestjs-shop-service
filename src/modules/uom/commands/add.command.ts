import { Uom } from '@modules/shared/models/uom.model'
import { RequestHandler, BaseCommandHandler, BaseCommand } from 'be-core'
import { UomRepository } from "@modules/shared/repositories/uom.repository";
import { IsNotEmpty } from "class-validator";

export class AddCommand extends BaseCommand<Uom> {

    @IsNotEmpty()
    public code: string;

    @IsNotEmpty()
    public name: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, Uom> {
    constructor(private uomRepository: UomRepository) {
        super()
    }

    public async apply(command: AddCommand): Promise<Uom> {
        let data = new Uom();
        data.code = command.code;
        data.name = command.name;
        data.description = command.description;
        data.status = command.status;

        data = await this.createBuild(data, command.session);
        return await this.uomRepository.add(data);
    }
}
