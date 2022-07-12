import { MessageConst } from './../../../constants/message.const';
import { AttributeModel } from '@modules/shared/models/attribute.model';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { AttributeQueries } from './../../shared/queries/attribute.queries';
import { AttributeRepository } from './../../shared/repositories/attribute.repository';

export class UpdateCommand extends BaseCommand<AttributeModel> {
    id: number;

    @IsNotEmpty()
    @MaxLength(50)
    attributeCode: string;

    @IsNotEmpty()
    @MaxLength(50)
    attributeName: string;

    @IsNotEmpty()
    @MaxLength(50)
    description: string;

    @IsNotEmpty()
    @MaxLength(50)
    status: string;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, AttributeModel> {
    /**
     *
     */
    constructor(
        private attributeRepo: AttributeRepository,
        private attributeQueries: AttributeQueries
    ) {
        super();
    }

    async apply(command: UpdateCommand): Promise<AttributeModel> {
        let attribute = await this.attributeQueries.get(command.id);
        if (!attribute) {
            throw new BusinessException(MessageConst.DataNotExist);
        }

        attribute.attributeCode = command.attributeCode;
        attribute.attributeName = command.attributeName;
        attribute.description = command.description;
        attribute.status = command.status;

        attribute = await this.updateBuild(attribute, command.session);
        return this.attributeRepo.update(attribute);
    }
}
