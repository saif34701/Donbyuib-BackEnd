import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaigns: CampaignsService) {}

  /* =====================
   * PUBLIC ROUTES
   * ===================== */

  @Get()
  getPublicCampaigns() {
    return this.campaigns.findAll();
  }
@Get('/:id')
getPublicCampaign(@Param('id') id: string) {
  return this.campaigns.findOne(id);
}


  /* =====================
   * ADMIN ROUTES
   * ===================== */

  @UseGuards(JwtAuthGuard)
  @Post('admin/campaigns')
  create(@Body() body: {
    title: string;
    description: string;
    goalAmount: number;
    associationId: string;
  }) {
    return this.campaigns.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/campaigns')
  findAll() {
    return this.campaigns.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/campaigns/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.campaigns.updateStatus(id, body.isActive);
  }
  @UseGuards(JwtAuthGuard)
@Patch('admin/campaigns/:id/pause')
pause(@Param('id') id: string) {
  return this.campaigns.updateStatus(id, false);
}

@UseGuards(JwtAuthGuard)
@Patch('admin/campaigns/:id/resume')
resume(@Param('id') id: string) {
  return this.campaigns.updateStatus(id, true);
}
}
