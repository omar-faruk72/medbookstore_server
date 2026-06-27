import { Test, TestingModule } from '@nestjs/testing';
import { PdfsController } from './pdfs.controller';
import { PdfsService } from './pdfs.service';

describe('PdfsController', () => {
  let controller: PdfsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfsController],
      providers: [PdfsService],
    }).compile();

    controller = module.get<PdfsController>(PdfsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
