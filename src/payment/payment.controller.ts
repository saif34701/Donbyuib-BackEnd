import { Body, Controller, Get, Post, Param, Res, Query } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-donation-and-pay')
  async createDonationAndPay(
    @Body()
    body: {
      campaignId: string;
      amount: number;
      donorName: string;
      donorEmail: string;
    },
  ) {
    console.log('=== PAYMENT CREATE ENDPOINT HIT ===');
    console.log('Request body:', JSON.stringify(body, null, 2));

    try {
      const result = await this.paymentService.createDonationAndPay(body);
      console.log('Payment URL generated:', result.paymentUrl);

      return result;
    } catch (error) {
      console.log('=== ERROR IN CONTROLLER ===');
      console.log('Error message:', error.message);
      throw error;
    }
  }

  @Get('verify/:donationId')
  async verifyPayment(@Param('donationId') donationId: string) {
    console.log('=== VERIFY PAYMENT ENDPOINT HIT ===');
    console.log('Donation ID:', donationId);

    try {
      const result = await this.paymentService.verifyPayment(donationId);
      console.log('Payment verification result:', result);
      return result;
    } catch (error) {
      console.log('=== ERROR IN VERIFY ===');
      console.log('Error:', error.message);
      throw error;
    }
  }

  @Get('callback')
  async callback(
    @Query('donationId') donationId: string,
    @Res() res: Response,
  ) {
    console.log('=== PAYMENT CALLBACK ENDPOINT HIT ===');
    console.log('Donation ID:', donationId);

    try {
      const result = await this.paymentService.verifyPayment(donationId);
      console.log('Payment verification result:', result);

      // Redirect to frontend payment return page
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/return?donationId=${donationId}`,
      );
    } catch (error) {
      console.log('=== ERROR IN CALLBACK ===');
      console.log('Error:', error.message);

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/return?donationId=${donationId}`,
      );
    }
  }
}
