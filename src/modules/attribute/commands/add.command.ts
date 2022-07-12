import { BaseCommand, BaseCommandHandler, RequestHandler } from 'be-core';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { AttributeModel } from './../../shared/models/attribute.model';
import { AttributeRepository } from './../../shared/repositories/attribute.repository';

export class AddCommand extends BaseCommand<AttributeModel> {
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

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, AttributeModel> {
    /**
     *
     */
    constructor(private attributeRepo: AttributeRepository) {
        super();
    }
    async apply(command: AddCommand) {
        let attribute = new AttributeModel();
        attribute.attributeCode = command.attributeCode;
        attribute.attributeName = command.attributeName;
        attribute.description = command.description;
        attribute.status = command.status;

        attribute = await this.createBuild(attribute, command.session);
        return this.attributeRepo.add(attribute);
    }
}
