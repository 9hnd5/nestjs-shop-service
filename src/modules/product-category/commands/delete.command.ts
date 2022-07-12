import { RequestHandler, BaseCommandHandler, BaseCommand, BusinessException } from 'be-core';
import { MessageConst } from '@constants/message.const';
import { ProductCategory } from '@modules/shared/models/product-category.model';
import { ProductCategoryQueries } from '@modules/shared/queries/product-category.queries';
import { ProductCategoryRepository } from '@modules/shared/repositories/product-category.repository';

export class DeleteCommand extends BaseCommand<number> {
    public id: number;
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, ProductCategory> {
    constructor(
        private productCategoryRepository: ProductCategoryRepository,
        private productCategoryQueries: ProductCategoryQueries
    ) {
        super();
    }

    async apply(command: DeleteCommand): Promise<ProductCategory> {
        let data = await this.productCategoryQueries.get(command.id);

        if (!data) {
            throw new BusinessException(MessageConst.DataNotExist);
        }

        if (data && !data.isDeleted) {
            data = this.deleteBuild(data, command.session);
            return this.productCategoryRepository.update(data);
        }
        return data;
    }
}
