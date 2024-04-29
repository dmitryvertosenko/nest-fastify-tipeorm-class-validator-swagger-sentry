import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  @ApiProperty({ required: true })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly password: string;
}
