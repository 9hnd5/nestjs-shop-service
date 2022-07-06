import {
    PriceListRepository
} from '@modules/shared/repositories/price-list.repository'
import {
    PriceListModel
} from '@modules/shared/models/price-list.model'
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core'
import { ApiProperty } from "@nestjs/swagger";
import { PriceListQueries } from "@modules/shared/queries/price-list.queries";
import { MaxLength } from "class-validator";
import { MessageConst } from "@constants/message.const";

export class UpdateCommand extends BaseCommand<PriceListModel> {
    @ApiProperty()
    public id: number;
    
    @MaxLength(50)
    @ApiProperty()
    public name: string;

    @MaxLength(50)
    @ApiProperty()
    public roundingMethod: string;

    @MaxLength(50)
    @ApiProperty()
    public roundingRule: string;

    @MaxLength(50)
    @ApiProperty()
    public description: string;

    @ApiProperty()
    public status: boolean;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, PriceListModel> {
    constructor(private priceListQueries: PriceListQueries, private priceListRepository: PriceListRepository) { 
        super()
    }

    public async apply(command: UpdateCommand): Promise<PriceListModel> {
        let priceList = await this.priceListQueries.get(command.id);
        if (!priceList) 
        {
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