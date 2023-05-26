import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import 'dotenv/config';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from './usecase/create.user.usecase';
import { RenameUseCase, RenameUseCaseInput } from './usecase/rename.usecase';
import {
  ChangePasswordUseCase,
  ChangePasswordUseCaseInput,
} from './usecase/change.password.usecase';

export class CreateUserDto {
  readonly username: string = '';
  readonly password: string = '';
}

export class RenameUserDto {
  readonly username: string = '';
}

export class ChangePasswordDto {
  readonly old_password?: string;
  readonly new_password: string;
  readonly confirm_password: string;
  readonly password_reset?: boolean;
  readonly password_expire_at: Date;
  readonly verify?: boolean;
  readonly is_api_domain?: boolean;
  readonly fail0821?: boolean;
}

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly renameUseCase: RenameUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const input: CreateUserUseCaseInput = {
      ...body,
    };

    const output = await this.createUserUseCase.execute(input);

    return {
      result: 'ok',
      ret: output,
    };
  }

  @Put('/:id')
  async rename(@Param('id') id: string, @Body() body: RenameUserDto) {
    const input: RenameUseCaseInput = {
      id,
      username: body.username,
    };

    const output = await this.renameUseCase.execute(input);

    return {
      result: 'ok',
      ret: output,
    };
  }

  @Put('/:id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordDto,
  ) {
    const input: ChangePasswordUseCaseInput = {
      id,
      oldPassword: body.old_password,
      newPassword: body.new_password,
      confirmPassword: body.confirm_password,
      passwordExpireAt: body.password_expire_at,
      passwordReset: body.password_reset,
      verify: body.verify,
      isApiDomain: body.is_api_domain,
      isFail0821: body.fail0821,
    };

    await this.changePasswordUseCase.execute(input);

    return { result: 'ok' };
  }
}
