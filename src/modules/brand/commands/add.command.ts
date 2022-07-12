import { BrandRepository } from './../../shared/repositories/brand.repository';
import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { BrandModel } from './../../shared/models/brand.model';

export class AddCommand extends BaseCommand<BrandModel> {
    @IsNotEmpty()
    @MaxLength(50)
    brandName: string;

    @IsNotEmpty()
    @MaxLength(50)
    description: string;

    @IsNotEmpty()
    @MaxLength(50)
    status: string;
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, BrandModel> {
    /**
     *
     */
    constructor(private brandRepo: BrandRepository) {
        super();
    }

    async apply(command: AddCommand): Promise<BrandModel> {
        let brand = new BrandModel();
        brand.brandName = command.brandName;
        brand.description = command.description;
        brand.status = command.status;

        brand = this.createBuild(brand, command.session);
        return await this.brandRepo.add(brand);
    }
}
