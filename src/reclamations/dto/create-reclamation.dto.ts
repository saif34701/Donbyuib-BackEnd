import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReclamationDto {
  @IsNotEmpty()
  @MaxLength(120)
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(150)
  subject: string;

  @IsNotEmpty()
  @MaxLength(3000)
  message: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  type: string;
}
