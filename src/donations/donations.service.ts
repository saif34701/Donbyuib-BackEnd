import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    campaignId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
  }) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id: data.campaignId },
    });

    if (!campaign || !campaign.isActive) {
      throw new BadRequestException('Campaign is not active');
    }

    return this.prisma.$transaction(async (tx) => {
      const donation = await tx.donation.create({
        data: {
          campaignId: data.campaignId,
          amount: data.amount,
          donorName: data.donorName,
          donorEmail: data.donorEmail,
          status: 'PENDING',
        },
      });

      await tx.campaign.update({
        where: { id: data.campaignId },
        data: {
          currentAmount: {
            increment: data.amount,
          },
        },
      });

      return donation;
    });
  }

  findAll() {
    return this.prisma.donation.findMany({
      include: { campaign: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
