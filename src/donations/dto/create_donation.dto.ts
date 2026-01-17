import { IsEmail, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateDonationDto {
  @IsUUID()
  campaignId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  donorName: string;

  @IsEmail()
  donorEmail: string;
}
