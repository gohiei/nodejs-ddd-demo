import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from '../../usecase/create.user.usecase';
import {
  RenameUseCase,
  RenameUseCaseInput,
} from '../../usecase/rename.usecase';
import {
  ChangePasswordUseCase,
  ChangePasswordUseCaseInput,
} from '../../usecase/change.password.usecase';
import {
  CheckIfARiskfulUserUseCase,
  CheckIfARiskfulUserUseCaseInput,
} from '../../usecase/handler/check-if-a-riskful-user.handler';
import {
  CreateUserDto,
  RenameUserDto,
  ChangePasswordDto,
} from './dto/user.dto';

@ApiTags('user')
@Controller('/api/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly renameUseCase: RenameUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly checkIfARiskfulUserUseCase: CheckIfARiskfulUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'User created' })
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
  @ApiOperation({ summary: 'Rename username' })
  @ApiResponse({ status: 200, description: 'Username renamed' })
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
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'User password changed' })
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

  @Put('/:id/check/riskful')
  @ApiOperation({ summary: 'Check an user is riskful or not' })
  @ApiResponse({ status: 200 })
  async checkRiskful(@Param('id') id: string) {
    const input: CheckIfARiskfulUserUseCaseInput = { id };

    await this.checkIfARiskfulUserUseCase.execute(input);

    return { result: 'ok' };
  }
}
