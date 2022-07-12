import { Type } from 'class-transformer';
import { ExampleRepository } from '@modules/shared/repositories/example.repository';
import { ExampleModel } from '@modules/shared/models/example.model';
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core';
import { ExampleQueries } from '@modules/shared/queries/example.queries';

export class UpdateCommand extends BaseCommand<ExampleModel> {
    @Type(() => ExampleModel)
    public data: ExampleModel;

    constructor(data: ExampleModel) {
        super();
        this.data = data;
    }
}

@RequestHandler(UpdateCommand)
export class UpdateCommandHandler extends BaseCommandHandler<UpdateCommand, ExampleModel> {
    constructor(
        private exampleRepository: ExampleRepository,
        private exampleQueries: ExampleQueries
    ) {
        super();
    }

    public async apply(command: UpdateCommand): Promise<ExampleModel> {
        if (!command.data) {
            throw new BusinessException('Dữ liệu nhập vào không đúng');
        }

        let example = await this.exampleQueries.get(command.data.id);

        if (!example) {
            throw new BusinessException('Dữ liệu không tồn tại');
        }
        example.name = command.data.name;
        example = this.updateBuild(example, command.session);
        return await this.exampleRepository.update(example);
    }
}
