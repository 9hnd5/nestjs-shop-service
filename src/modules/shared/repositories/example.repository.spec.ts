import { REQUEST } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExampleModel } from '../models/example.model';
import { ExampleRepository } from './example.repository';

describe('Example repository test', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    let exampleRepository: ExampleRepository;

    const typeOrmExampleTestRepository = {
        save: jest.fn(),
    };

    const typeOrmExampleTestRepositoryProvider = {
        provide: getRepositoryToken(ExampleModel),
        useFactory: () => typeOrmExampleTestRepository,
    };

    const requestMock = {
        scopeVariable: {},
    };

    const requestProvider = {
        provide: REQUEST,
        useFactory: () => requestMock,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [typeOrmExampleTestRepositoryProvider, requestProvider, ExampleRepository],
        }).compile();

        exampleRepository = await moduleRef.resolve<ExampleRepository>(ExampleRepository);
    });

    test('Add function. Should run as expected', async () => {
        await exampleRepository.add({
            name: 'name',
        } as any);

        expect(typeOrmExampleTestRepository.save).toBeCalledTimes(1);
        expect(typeOrmExampleTestRepository.save).toBeCalledWith({
            name: 'name',
        });
    });

    test('Update function. Should run as expected', async () => {
        await exampleRepository.update({
            id: 1,
            name: 'name',
        } as any);

        expect(typeOrmExampleTestRepository.save).toBeCalledTimes(1);
        expect(typeOrmExampleTestRepository.save).toBeCalledWith({
            id: 1,
            name: 'name',
        });
    });
});
