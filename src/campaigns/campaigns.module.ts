import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CampaignsService],
  controllers: [CampaignsController],
  exports: [CampaignsService]
})
export class CampaignsModule {}
