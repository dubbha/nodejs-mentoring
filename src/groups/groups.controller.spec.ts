import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { LoggerService } from '../core/services';

describe('GroupsController', () => {
  let controller: GroupsController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByLogin: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as Partial<GroupsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, LoggerService],
    })
      .overrideProvider(GroupsService)
      .useValue(service)
      .compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
