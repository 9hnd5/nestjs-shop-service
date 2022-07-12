import { Type } from 'class-transformer';
import { ExampleRepository } from '@modules/shared/repositories/example.repository';
import { ExampleModel } from '@modules/shared/models/example.model';
import { RequestHandler, BusinessException, BaseCommandHandler, BaseCommand } from 'be-core';

export class AddCommand extends BaseCommand<ExampleModel> {
    @Type(() => ExampleModel)
    public data: ExampleModel;

    constructor(data: ExampleModel) {
        super();
        this.data = data;
    }
}

@RequestHandler(AddCommand)
export class AddCommandHandler extends BaseCommandHandler<AddCommand, ExampleModel> {
    constructor(private exampleRepository: ExampleRepository) {
        super();
    }

    public async apply(command: AddCommand): Promise<ExampleModel> {
        if (!command.data) throw new BusinessException('Dữ liệu không được bỏ trống');
        command.data = this.createBuild(command.data, command.session);
        return await this.exampleRepository.add(command.data);
    }
}
