import { Uom } from '@modules/shared/models/uom.model'
import { RequestHandler, BaseCommandHandler, BaseCommand, BusinessException } from 'be-core'
import { UomQueries } from '@modules/shared/queries/uom.queries'
import { UomRepository } from '@modules/shared/repositories/uom.repository';

export class DeleteCommand extends BaseCommand<number> {
    public id: number
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, Uom> {
    constructor(private uomRepository: UomRepository, private uomQueries: UomQueries) { 
        super()
    }

    async apply(command: DeleteCommand): Promise<Uom> {
        let data = await this.uomQueries.get(command.id);

        if (!data) {
            throw new BusinessException('Dữ liệu không tồn tại')
        }
        
        if (data && !data.isDeleted) {
            data = await this.deleteBuild(data, command.session);
            return this.uomRepository.update(data);
        }
        return data;
    }
}