import { MessageConst } from '@constants/message.const';
import { Variant } from '@modules/shared/models/variant.model';
import { VariantQueries } from '@modules/shared/queries/variant.queries';
import { VariantRepository } from '@modules/shared/repositories/variant.repository';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
export class UpdateCommand extends BaseCommand<Variant> {
    public id: number;

    @IsNotEmpty()
    public code: string;

    @IsNotEmpty()
    public variantName: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, Variant> {
    constructor(
        private variantRepository: VariantRepository,
        private variantQueries: VariantQueries
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<Variant> {
        let variant = await this.variantQueries.get(command.id);

        if (!variant) {
            throw new BusinessException(MessageConst.DataNotExist);
        }
        variant.variantName = command.variantName;
        variant.description = command.description;
        variant.status = command.status;
        variant = await this.updateBuild(variant, command.session);
        return await this.variantRepository.update(variant);
    }
}
