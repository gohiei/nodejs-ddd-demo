import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import 'dotenv/config';
import {
  CreateUserUseCase,
  CreateUserUseCaseInput,
} from './usecase/create.user.usecase';
import { RenameUseCase, RenameUseCaseInput } from './usecase/rename.usecase';

export class CreateUserDto {
  readonly username: string = '';
  readonly password: string = '';
}

export class RenameUserDto {
  readonly username: string = '';
}

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly renameUseCase: RenameUseCase,
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
}
