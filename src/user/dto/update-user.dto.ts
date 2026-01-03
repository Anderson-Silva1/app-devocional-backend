import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'O nome precisa ser uma string' })
  @MinLength(5, { message: 'O nome precisa ter no mínimo 5 caracteres' })
  @MaxLength(100, { message: 'O nome pode ter no máximo 100 caracteres' })
  readonly name?: string;

  @IsString({ message: 'O email precisa ser uma string' })
  @MinLength(5, { message: 'O email precisa ter no mínimo 5 caracteres' })
  @MaxLength(100, { message: 'O email pode ter no máximo 100 caracteres' })
  readonly email?: string;

  @IsString({ message: 'A senha precisa ser uma string' })
  @MinLength(5, { message: 'A senha precisa ter no mínimo 5 caracteres' })
  @MaxLength(100, { message: 'A senha pode ter no máximo 100 caracteres' })
  readonly password?: string;
}
