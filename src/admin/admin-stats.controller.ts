import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminStatsService } from './admin-stats.service';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard)
export class AdminStatsController {
  constructor(private stats: AdminStatsService) {}

  @Get('global')
  getGlobal() {
    return this.stats.getGlobalStats();
  }

  @Get('campaigns')
  getCampaigns() {
    return this.stats.getCampaignStats();
  }
}
