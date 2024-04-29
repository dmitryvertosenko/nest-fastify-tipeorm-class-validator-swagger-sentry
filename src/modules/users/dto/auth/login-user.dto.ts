import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDTO {
  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase())
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
