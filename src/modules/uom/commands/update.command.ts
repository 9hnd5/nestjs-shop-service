import { MessageConst } from '@constants/message.const';
import { Uom } from '@modules/shared/models/uom.model';
import { UomQueries } from '@modules/shared/queries/uom.queries';
import { UomRepository } from '@modules/shared/repositories/uom.repository';
import { BaseCommand, BaseCommandHandler, BusinessException, RequestHandler } from 'be-core';
import { IsNotEmpty } from 'class-validator';
export class UpdateCommand extends BaseCommand<Uom> {
    public id: number;

    @IsNotEmpty()
    public code: string;

    @IsNotEmpty()
    public name: string;

    public description: string;

    @IsNotEmpty()
    public status: boolean;
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, Uom> {
    constructor(private uomRepository: UomRepository, private uomQueries: UomQueries) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<Uom> {
        let uom = await this.uomQueries.get(command.id);

        if (!uom) {
            throw new BusinessException(MessageConst.DataNotExist);
        }
        uom.name = command.name;
        uom.description = command.description;
        uom.status = command.status;
        uom = this.updateBuild(uom, command.session);
        return await this.uomRepository.update(uom);
    }
}
