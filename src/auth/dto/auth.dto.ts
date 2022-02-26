import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto extends AuthDto {
  @MinLength(8)
  password: string;
}
