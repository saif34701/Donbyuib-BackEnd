import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReclamationDto } from './dto/create-reclamation.dto';
import { ReclamationsService } from './reclamations.service';

@Controller()
export class ReclamationsController {
  constructor(private readonly reclamationsService: ReclamationsService) {}

  @Post('reclamations')
  create(@Body() body: CreateReclamationDto) {
    return this.reclamationsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/reclamations')
  findAll() {
    return this.reclamationsService.findAll();
  }
}
