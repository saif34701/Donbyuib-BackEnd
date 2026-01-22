import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminStatsController } from './admin-stats.controller';
import { AdminStatsService } from './admin-stats.service';
import { AdminCampaignsController } from './admin-campaigns.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [CampaignsModule],
  controllers: [
    AdminController,
    AdminStatsController,
    AdminCampaignsController,
  ],
  providers: [AdminStatsService],
})
export class AdminModule {}
