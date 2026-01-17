import { IsUUID } from 'class-validator';

export class InitiateClictopayDto {
  @IsUUID()
  donationId: string;
}