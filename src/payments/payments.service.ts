import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiateClictopay(donationId: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { campaign: true },
    });

    if (!donation) throw new NotFoundException('Donation not found');
    if (donation.status !== 'PENDING')
      throw new BadRequestException('Donation is not payable');
    if (!donation.campaign.isActive)
      throw new BadRequestException('Campaign is not active');

    const { clictopayUserName, clictopayPassword } = donation.campaign;
    if (!clictopayUserName || !clictopayPassword) {
      throw new BadRequestException(
        'Campaign is not configured for ClicToPay',
      );
    }

    const payload = {
      userName: clictopayUserName,
      password: clictopayPassword,
      amount: donation.amount * 1000, 
      currency: process.env.CLICTOPAY_CURRENCY,
      orderNumber: donation.id,
      returnUrl: process.env.CLICTOPAY_RETURN_URL,
    };

    let response;
    try {
      response = await axios.post(
        process.env.CLICTOPAY_REGISTER_URL!,
        null,
        { params: payload },
      );
    } catch (err) {
      throw new BadRequestException('ClicToPay registration failed');
    }

    const data = response.data;

    if (!data.orderId || !data.formUrl) {
      throw new BadRequestException(
        'Invalid response from ClicToPay',
      );
    }

    await this.prisma.donation.update({
      where: { id: donation.id },
      data: { clictopayOrderId: data.orderId },
    });

    return {
      redirectUrl: data.formUrl,
    };
  }
}
