import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminStatsController } from './admin-stats.controller';
import { AdminStatsService } from './admin-stats.service';

@Module({
  controllers: [
    AdminController,
    AdminStatsController, 
  ],
  providers: [AdminStatsService],
})
export class AdminModule {}
