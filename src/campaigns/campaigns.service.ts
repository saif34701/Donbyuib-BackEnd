import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    description: string;
    goalAmount: number;
    associationId: string;
  }) {
    return this.prisma.campaign.create({
      data,
    });
  }

  findAll() {
    return this.prisma.campaign.findMany({
  where: {
    isActive: true,
  },
  include: {
    association: true,
  },
});
  }
  findOne(id: string) {
  return this.prisma.campaign.findUnique({
    where: { id },
    include: { association: true },
  });
}


  updateStatus(id: string, isActive: boolean) {
    return this.prisma.campaign.update({
      where: { id },
      data: { isActive },
    });
  }
}
