import { RequestHandler, BaseCommandHandler, BaseCommand } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { Variant } from '@modules/shared/models/variant.model';
import { VariantRepository } from '@modules/shared/repositories/variant.repository';

export class AddCommand extends BaseCommand<Variant> {
    @IsNotEmpty()
    public code: string;

    @IsNotEmpty()
    public variantName: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, Variant> {
    constructor(private variantRepository: VariantRepository) {
        super();
    }

    public async apply(command: AddCommand): Promise<Variant> {
        let data = new Variant();
        data.code = command.code;
        data.variantName = command.variantName;
        data.description = command.description;
        data.status = command.status;

        data = await this.createBuild(data, command.session);
        return await this.variantRepository.add(data);
    }
}
