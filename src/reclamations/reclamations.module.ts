import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReclamationsController } from './reclamations.controller';
import { ReclamationsService } from './reclamations.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReclamationsController],
  providers: [ReclamationsService],
})
export class ReclamationsModule {}
