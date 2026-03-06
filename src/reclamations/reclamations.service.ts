import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReclamationDto } from './dto/create-reclamation.dto';

@Injectable()
export class ReclamationsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateReclamationDto) {
    return this.prisma.reclamation.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        type: data.type,
      },
    });
  }

  findAll() {
    return this.prisma.reclamation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
