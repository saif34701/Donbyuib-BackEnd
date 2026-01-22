import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssociationsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.association.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        mail: true,
        phone: true,
      },
    });
  }
}
