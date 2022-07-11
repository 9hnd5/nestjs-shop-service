import { MessageConst } from '@constants/message.const';
import { ProductCategory } from '@modules/shared/models/product-category.model';
import { ProductCategoryQueries } from '@modules/shared/queries/product-category.queries';
import { ProductCategoryRepository } from '@modules/shared/repositories/product-category.repository';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
export class UpdateCommand extends BaseCommand<ProductCategory> {
    public id: number;

    @IsNotEmpty()
    public productCode: string;

    @IsNotEmpty()
    public productGroup: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, ProductCategory> {
    constructor(
        private productCategoryRepository: ProductCategoryRepository,
        private productCategoryQueries: ProductCategoryQueries
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<ProductCategory> {
        let uom = await this.productCategoryQueries.get(command.id);

        if (!uom) {
            throw new BusinessException(MessageConst.DataNotExist);
        }
        uom.productCode = command.productCode;
        uom.productGroup = command.productGroup;
        uom.description = command.description;
        uom.status = command.status;
        uom = await this.updateBuild(uom, command.session);
        return await this.productCategoryRepository.update(uom);
    }
}
