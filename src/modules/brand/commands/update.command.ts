import { BrandModel } from '@modules/shared/models/brand.model';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
import { MessageConst } from './../../../constants/message.const';
import { BrandQueries } from './../../shared/queries/brand.queries';
import { BrandRepository } from './../../shared/repositories/brand.repository';

export class UpdateCommand extends BaseCommand<BrandModel> {
    id: number;
    @IsNotEmpty()
    brandName: string;
    description: string;
    status: string;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, BrandModel> {
    /**
     *
     */
    constructor(private brandRepo: BrandRepository, private brandQueries: BrandQueries) {
        super();
    }

    async apply(command: UpdateCommand): Promise<BrandModel> {
        let brand = await this.brandQueries.get(command.id);

        if (!brand) {
            throw new BusinessException(MessageConst.DataNotExist);
        }
        brand.brandName = command.brandName;
        brand.description = command.description;
        brand.status = command.status;

        brand = await this.updateBuild(brand, command.session);
        return await this.brandRepo.update(brand);
    }
}
