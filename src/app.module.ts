import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { DonationsModule } from './donations/donations.module';
import { AdminModule } from './admin/admin.module';
import { AssociationsModule } from './associations/associations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    AuthModule,
    PrismaModule,
    AdminModule,
    CampaignsModule,
    DonationsModule,
    
    AssociationsModule,
  ],
})
export class AppModule {}
