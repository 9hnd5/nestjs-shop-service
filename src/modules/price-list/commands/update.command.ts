import { PriceListRepository } from '@modules/shared/repositories/price-list.repository';
import { PriceListModel } from '@modules/shared/models/price-list.model';
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core';
import { PriceListQueries } from '@modules/shared/queries/price-list.queries';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { MessageConst, PriceListStatus } from '@constants/.';

export class UpdateCommand extends BaseCommand<PriceListModel> {
    public id: number;

    @IsNotEmpty()
    @MaxLength(50)
    public name: string;

    @IsNotEmpty()
    @MaxLength(50)
    public roundingMethod: string;

    @IsNotEmpty()
    @MaxLength(50)
    public roundingRule: string;

    @IsNotEmpty()
    @MaxLength(50)
    public description: string;

    @MaxLength(20)
    @IsEnum(PriceListStatus)
    public status: PriceListStatus;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, PriceListModel> {
    constructor(
        private priceListQueries: PriceListQueries,
        private priceListRepository: PriceListRepository
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<PriceListModel> {
        let priceList = await this.priceListQueries.get(command.id);
        if (!priceList) {
            throw new BusinessException(MessageConst.DataNotExist);
        }

        priceList.name = command.name;
        priceList.roundingMethod = command.roundingMethod;
        priceList.roundingRule = command.roundingRule;
        priceList.description = command.description;
        priceList.status = command.status;
        priceList = await this.updateBuild(priceList, command.session);
        return await this.priceListRepository.update(priceList);
    }
}
