import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly username: string = '';

  @ApiProperty()
  readonly password: string = '';
}

export class RenameUserDto {
  @ApiProperty()
  readonly username: string = '';
}

export class ChangePasswordDto {
  @ApiProperty()
  readonly old_password?: string;

  @ApiProperty()
  readonly new_password: string;

  @ApiProperty()
  readonly confirm_password: string;

  @ApiProperty()
  readonly password_reset?: boolean;

  @ApiProperty()
  readonly password_expire_at: Date;

  @ApiProperty()
  readonly verify?: boolean;

  @ApiProperty()
  readonly is_api_domain?: boolean;

  @ApiProperty()
  readonly fail0821?: boolean;
}
