import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  private httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  async createDonationAndPay(data: {
    campaignId: string;
    amount: number;
    donorName: string;
    donorEmail: string;
  }) {
    console.log('=== PAYMENT REQUEST START ===');
    console.log('Data received:', JSON.stringify(data, null, 2));

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: data.campaignId },
    });

    console.log('Campaign found:', campaign ? 'YES' : 'NO');
    if (campaign) {
      console.log('Campaign details:', {
        id: campaign.id,
        title: campaign.title,
        isActive: campaign.isActive,
        hasUsername: !!campaign.clictopayUserName,
        hasPassword: !!campaign.clictopayPassword,
      });
    }

    if (!campaign || !campaign.isActive) {
      console.log('ERROR: Campaign not available');
      throw new BadRequestException('Campaign not available');
    }

    if (!campaign.clictopayUserName || !campaign.clictopayPassword) {
      console.log('ERROR: Payment not configured');
      throw new BadRequestException('Payment not configured for this campaign');
    }

    console.log('Creating donation...');
    const donation = await this.prisma.donation.create({
      data: {
        campaignId: campaign.id,
        amount: data.amount,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        status: 'PENDING',
      },
    });
    console.log('Donation created with ID:', donation.id);

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('amount', (donation.amount * 1000).toString());
    formData.append('language', 'fr');
    formData.append('currency', '788');
    formData.append('orderNumber', donation.id);
    formData.append('userName', campaign.clictopayUserName);
    formData.append('password', campaign.clictopayPassword);
    formData.append('returnUrl', `${process.env.API_URL}/payment/callback?donationId=${donation.id}`);

    console.log('ClicToPay payload:', {
      amount: donation.amount * 1000,
      language: 'fr',
      currency: '788',
      orderNumber: donation.id,
      userName: campaign.clictopayUserName,
      password: '***HIDDEN***',
      returnUrl: `${process.env.API_URL}/payment/callback?donationId=${donation.id}`
    });

    let response;

    try {
      console.log('Calling ClicToPay TEST API...');
      response = await axios.post(
        'https://test.clictopay.com/payment/rest/register.do', // TEST URL
        formData.toString(),
        { 
          httpsAgent: this.httpsAgent,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        },
      );
      console.log('ClicToPay response:', response.data);
    } catch (err) {
      console.log('ERROR: ClicToPay API call failed:', err.message);
      if (err.response) {
        console.log('Error response:', err.response.data);
      }
      throw new BadRequestException('ClicToPay unreachable');
    }

    // Check for error in response
    if (response.data?.errorCode && response.data.errorCode !== '0') {
      console.log('ERROR: ClicToPay returned error:', response.data);
      throw new BadRequestException(`ClicToPay error: ${response.data.errorMessage || 'Registration failed'}`);
    }

    if (!response.data?.formUrl || !response.data?.orderId) {
      console.log('ERROR: Invalid ClicToPay response:', response.data);
      throw new BadRequestException('ClicToPay registration failed');
    }

    await this.prisma.donation.update({
      where: { id: donation.id },
      data: {
        clictopayOrderId: response.data.orderId,
        paymentRef: donation.id,
      },
    });

    console.log('=== PAYMENT REQUEST SUCCESS ===');
    return {
      paymentUrl: response.data.formUrl,
    };
  }
  
  async verifyPayment(donationId: string) {
    console.log('=== VERIFY PAYMENT START ===');
    console.log('Donation ID:', donationId);

    const donation = await this.prisma.donation.findUnique({
      where: { id: donationId },
      include: { campaign: true },
    });

    if (!donation || !donation.clictopayOrderId) {
      throw new BadRequestException('Invalid donation');
    }

    const formData = new URLSearchParams();
    formData.append('orderId', donation.clictopayOrderId);
    formData.append('userName', donation.campaign.clictopayUserName ?? '');
    formData.append('password', donation.campaign.clictopayPassword ?? '');

    console.log('Checking payment status with ClicToPay TEST...');

    let response;

    try {
      response = await axios.post(
        'https://test.clictopay.com/payment/rest/getOrderStatus.do', // TEST URL
        formData.toString(),
        { 
          httpsAgent: this.httpsAgent,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        },
      );
      console.log('ClicToPay status response:', response.data);
    } catch (err) {
      console.log('ERROR: ClicToPay status check failed:', err.message);
      throw new BadRequestException('ClicToPay status check failed');
    }

    const errorCode = response.data?.ErrorCode;
    const orderStatus = response.data?.OrderStatus;

    console.log('Payment status:', { errorCode, orderStatus });

    if (errorCode === '0') {
      if (orderStatus === '2') {
        await this.prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'PAID' },
        });

        await this.prisma.campaign.update({
          where: { id: donation.campaignId },
          data: {
            currentAmount: {
              increment: donation.amount
            }
          }
        });

        console.log('Payment PAID - Campaign amount updated');
        return { status: 'PAID', message: 'Payment successful' };
      }

      if (orderStatus === '6') {
        await this.prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'FAILED' },
        });

        console.log('Payment FAILED');
        return { status: 'FAILED', message: 'Payment refused' };
      }

      console.log('Payment still PENDING');
      return { status: 'PENDING', message: 'Payment pending', orderStatus };
    }

    console.log('Payment verification error:', response.data?.ErrorMessage);
    return { 
      status: 'ERROR', 
      message: response.data?.ErrorMessage || 'Verification error',
      errorCode 
    };
  }
}