import { UomQueries } from '@modules/shared/queries/uom.queries';
import { ExampleRepository } from '@modules/shared/repositories/example.repository';
import { Test } from '@nestjs/testing';
import { AddCommand, AddCommandHandler } from './add.command';

describe('Uom add command test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  let handler: AddCommandHandler

  const exampleRepository = {
    add: jest.fn(),
    update: jest.fn()
  };

  const exampleRepositoryProvider = {
    provide: ExampleRepository,
    useFactory: () => exampleRepository,
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [exampleRepositoryProvider, AddCommandHandler],
    }).compile()

    handler = await moduleRef.resolve<AddCommandHandler>(AddCommandHandler)
  })

  test('Run apply successfully. Should run as expected', async () => {
    const data = new AddCommand({
      name: 'name'
    } as any)
    await handler.apply(data)

    expect(exampleRepository.add).toBeCalledTimes(1)
    expect(exampleRepository.add).toBeCalledWith(data.data)
    expect(data.data.isDeleted).toBe(false)
    expect(data.data.createdBy).toBe(0)
    expect(data.data.createdDate).toBeDefined()
  })

  test('Run apply with data is null. Should run as expected', async () => {
    const data = new AddCommand(null)

    try
    {
      await handler.apply(data)
      expect(exampleRepository.add).toBeCalledTimes(0)
    }
    catch(err) {
      expect(err).toBeDefined()
    }
  })
})
