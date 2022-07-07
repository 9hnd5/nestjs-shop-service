import {
    Body,
    Controller,
    Delete,
    Get,
    Injectable,
    Post,
    Put,
    Scope,
    UseInterceptors,
    Param,
    Inject,
} from '@nestjs/common';
import { AddCommand, DeleteCommand, UpdateCommand } from './commands';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import {
    Authorization,
    BaseController,
    BusinessException,
    CoreResponseInterceptor,
    Mediator,
    Permissions,
    Headers,
} from 'be-core';
import { ExampleQueries } from '@modules/shared/queries/example.queries';

@Controller('/core/v1/example')
@Injectable({ scope: Scope.REQUEST })
@UseInterceptors(CoreResponseInterceptor)
@ApiTags('Example')
@Headers()
export class ExampleController extends BaseController {
    constructor(
        @Inject(REQUEST) httpRequest: any,
        private mediator: Mediator,
        private exampleQueries: ExampleQueries
    ) {
        super(httpRequest);
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: Number })
    @Authorization('exampleManagement', Permissions.View, true)
    async get(@Param('id') id: number) {
        return this.exampleQueries.get(id);
    }

    @Get('')
    @Authorization('exampleManagement', Permissions.View, true)
    async gets() {
        return this.exampleQueries.gets();
    }

    @Post('')
    @ApiBody({ type: AddCommand })
    @Authorization('exampleManagement', Permissions.Insert, true)
    async add(@Body() command: AddCommand) {
        return this.mediator.send(command);
    }

    @Put('')
    @ApiBody({ type: UpdateCommand })
    @Authorization('exampleManagement', Permissions.Update, true)
    async update(@Body() command: UpdateCommand) {
        return this.mediator.send(command);
    }

    @Delete('')
    @ApiBody({ type: DeleteCommand })
    @Authorization('exampleManagement', Permissions.Delete)
    async delete(@Body() command: DeleteCommand) {
        return this.mediator.send(command);
    }

    @Get('system-error')
    systemError() {
        throw 'any error';
    }

    @Get('business-error')
    businessError() {
        throw new BusinessException('business error');
    }
}
