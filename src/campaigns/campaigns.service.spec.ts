import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CampaignsService', () => {
  let service: CampaignsService;
  const mockPrisma: any = { campaign: { findMany: jest.fn(), findUnique: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampaignsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
