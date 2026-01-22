import { Test, TestingModule } from '@nestjs/testing';
import { DonationsService } from './donations.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DonationsService', () => {
  let service: DonationsService;
  const mockPrisma: any = { donation: { create: jest.fn(), findMany: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<DonationsService>(DonationsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
