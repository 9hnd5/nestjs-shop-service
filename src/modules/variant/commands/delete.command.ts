import { RequestHandler, BaseCommandHandler, BaseCommand, BusinessException } from 'be-core';
import { Variant } from '@modules/shared/models/variant.model';
import { MessageConst } from '@constants/message.const';
import { VariantRepository } from '@modules/shared/repositories/variant.repository';
import { VariantQueries } from '@modules/shared/queries/variant.queries';

export class DeleteCommand extends BaseCommand<number> {
    public id: number;
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, Variant> {
    constructor(
        private variantRepository: VariantRepository,
        private variantQueries: VariantQueries
    ) {
        super();
    }

    async apply(command: DeleteCommand): Promise<Variant> {
        let data = await this.variantQueries.get(command.id);

        if (!data) {
            throw new BusinessException(MessageConst.DataNotExist);
        }

        if (data && !data.isDeleted) {
            data = await this.deleteBuild(data, command.session);
            return this.variantRepository.update(data);
        }
        return data;
    }
}
