import {
    ExampleRepository
} from '@modules/shared/repositories/example.repository'
import {
    ExampleModel
} from '@modules/shared/models/example.model'
import { RequestHandler, BaseCommandHandler, BaseCommand, BusinessException } from 'be-core'
import { ExampleQueries } from '@modules/shared/queries/example.queries'
import { MessageConst } from '@constants/.'

export class DeleteCommand extends BaseCommand<number> {
    constructor(
        public id: number
    ) { 
        super()
    }
}

@RequestHandler(DeleteCommand)
export class DeleteCommandHandler extends BaseCommandHandler<DeleteCommand, ExampleModel | null> {
    constructor(private exampleRepository: ExampleRepository, private exampleQueries: ExampleQueries) { 
        super()
    }

    async apply(command: DeleteCommand) {
        let data = await this.exampleQueries.get(command.id)
        if (!data) 
        {
            throw new BusinessException(MessageConst.DataNotExist);
        }

        if (!data.isDeleted) {
            data = await this.deleteBuild(data, command.session);
            return this.exampleRepository.update(data);
        }
        return data;
    }
}