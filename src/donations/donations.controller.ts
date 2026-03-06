import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDonationDto } from './dto/create_donation.dto';

@Controller()
export class DonationsController {
  constructor(private donations: DonationsService) {}

@Post('donations')
create(@Body() body: CreateDonationDto) {
  return this.donations.create(body);
}

  @Get('donations/:id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.donations.findById(id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('admin/donations')
  findAll() {
    return this.donations.findAll();
  }
}
