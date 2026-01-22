import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminStatsService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [
      totalAmount,
      totalDonations,
      totalCampaigns,
      activeCampaigns,
      pausedCampaigns,
    ] = await Promise.all([
      this.prisma.donation.aggregate({
        _sum: { amount: true },
      }),
      this.prisma.donation.count(),
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { isActive: true } }),
      this.prisma.campaign.count({ where: { isActive: false } }),
    ]);

    return {
      totalAmountRaised: totalAmount._sum.amount ?? 0,
      totalDonations,
      totalCampaigns,
      activeCampaigns,
      pausedCampaigns,
    };
  }

  async getCampaignStats() {
    const campaigns = await this.prisma.campaign.findMany({
      include: {
        _count: {
          select: { donations: true },
        },
      },
    });

    return campaigns.map((c) => ({
      id: c.id,
      title: c.title,
      currentAmount: c.currentAmount,
      donationCount: c._count.donations,
      progressPercent: 0,
      isActive: c.isActive,
    }));
  }
}
