import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaigns: CampaignsService) {}

  @Get()
  getPublicCampaigns() {
    return this.campaigns.findAll();
  }

  @Get('/:id')
  getPublicCampaign(@Param('id') id: string) {
    return this.campaigns.findOne(id);
  }
}
