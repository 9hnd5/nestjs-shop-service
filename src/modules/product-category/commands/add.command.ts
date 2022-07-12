import { RequestHandler, BaseCommandHandler, BaseCommand } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { ProductCategory } from '@modules/shared/models/product-category.model';
import { ProductCategoryRepository } from '@modules/shared/repositories/product-category.repository';

export class AddCommand extends BaseCommand<ProductCategory> {
    @IsNotEmpty()
    public productCode: string;

    @IsNotEmpty()
    public productGroup: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, ProductCategory> {
    constructor(private productCategoryRepository: ProductCategoryRepository) {
        super();
    }

    public async apply(command: AddCommand): Promise<ProductCategory> {
        let data = new ProductCategory();
        data.productCode = command.productCode;
        data.productGroup = command.productGroup;
        data.description = command.description;
        data.status = command.status;

        data = this.createBuild(data, command.session);
        return await this.productCategoryRepository.add(data);
    }
}
