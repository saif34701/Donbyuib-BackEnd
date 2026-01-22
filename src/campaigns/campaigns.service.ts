import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    description: string;
    associationId: string;
  }) {
    return this.prisma.campaign.create({
      data,
    });
  }

  findAll() {
    return this.prisma.campaign.findMany({
      include: {
        association: true,
      },
      orderBy: { createdAt: 'desc' },
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

  async delete(id: string) {
    await this.prisma.donation.deleteMany({
      where: { campaignId: id },
    });
    
    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
