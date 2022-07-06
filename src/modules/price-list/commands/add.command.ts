import { Type } from "class-transformer";
import {
    PriceListRepository
} from '@modules/shared/repositories/price-list.repository'
import {
    PriceListModel
} from '@modules/shared/models/price-list.model'
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core'
import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class AddCommand extends BaseCommand<PriceListModel> {
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

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, PriceListModel> {
    constructor(private priceListRepository: PriceListRepository) {
        super()
    }

    public async apply(command: AddCommand): Promise<PriceListModel> {
        let priceList = new PriceListModel();
        priceList.name = command.name;
        priceList.roundingMethod = command.roundingMethod;
        priceList.roundingRule = command.roundingRule;
        priceList.description = command.description;
        priceList.status = command.status;

        priceList = await this.createBuild(priceList, command.session);
        return await this.priceListRepository.add(priceList);
    }
}