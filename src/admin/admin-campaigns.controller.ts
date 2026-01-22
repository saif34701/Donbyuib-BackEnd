import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/campaigns')
@UseGuards(JwtAuthGuard)
export class AdminCampaignsController {
  constructor(private campaigns: CampaignsService) {}

  @Post()
  create(@Body() body: {
    title: string;
    description: string;
    associationId: string;
  }) {
    return this.campaigns.create(body);
  }

  @Get()
  findAll() {
    return this.campaigns.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.campaigns.updateStatus(id, body.isActive);
  }

  @Patch(':id/pause')
  pause(@Param('id') id: string) {
    return this.campaigns.updateStatus(id, false);
  }

  @Patch(':id/resume')
  resume(@Param('id') id: string) {
    return this.campaigns.updateStatus(id, true);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.campaigns.delete(id);
  }
}
