import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiateClictopayDto } from './dto/initiate-clictopay.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('clictopay/initiate')
  initiate(@Body() body: InitiateClictopayDto) {
    return this.payments.initiateClictopay(body.donationId);
  }
}
