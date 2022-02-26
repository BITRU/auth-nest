import { IsEmail, IsNotEmpty } from 'class-validator';

export class BlockUserActiveTokensDto {
  @IsNotEmpty()
  @IsEmail()
  username: string;
}
