import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import type { Response } from 'express';
import { PaymentService } from "./payment.service";

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('test')
  test() {
    console.log('=== TEST GET ENDPOINT HIT ===');
    return { 
      message: 'Payment controller is working!', 
      timestamp: new Date(),
      endpoints: {
        register: 'POST /payment/register',
        callback: 'GET /payment/callback?donationId=xxx'
      }
    };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      campaignId: string;
      amount: number;
      donorName: string;
      donorEmail: string;
    },
    @Res() res: Response,
  ) {
    console.log('=== PAYMENT REGISTER ENDPOINT HIT ===');
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
      const result = await this.paymentService.createDonationAndPay(body);
      console.log('Payment URL generated:', result.paymentUrl);
      
      // Redirect to ClicToPay payment page
      return res.redirect(result.paymentUrl);
    } catch (error) {
      console.log('=== ERROR IN CONTROLLER ===');
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      
      // Return error as JSON instead of redirecting
      return res.status(error.status || 500).json({
        statusCode: error.status || 500,
        message: error.message,
        error: error.name
      });
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
      
      // Redirect based on payment status
      if (result.status === 'PAID') {
        // Redirect to success page
        return res.redirect(`${process.env.FRONTEND_URL}/payment/success?donationId=${donationId}`);
      } else if (result.status === 'FAILED') {
        // Redirect to failure page
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?donationId=${donationId}`);
      } else {
        // Redirect to pending page
        return res.redirect(`${process.env.FRONTEND_URL}/payment/pending?donationId=${donationId}`);
      }
    } catch (error) {
      console.log('=== ERROR IN CALLBACK ===');
      console.log('Error:', error.message);
      
      // Redirect to error page
      return res.redirect(`${process.env.FRONTEND_URL}/payment/error?donationId=${donationId}`);
    }
  }

  // Optional: Endpoint to check payment status manually
  @Get('status/:donationId')
  async checkStatus(@Query('donationId') donationId: string) {
    console.log('=== CHECK PAYMENT STATUS ===');
    console.log('Donation ID:', donationId);
    
    return this.paymentService.verifyPayment(donationId);
  }
}