import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/test')
@UseGuards(JwtAuthGuard)
export class AdminController {
  @Get()
  test() {
    return { message: 'Admin route is protected 🔐' };
  }
}
