import { Controller, Get, Module } from '@nestjs/common';
import { LoggerModule } from '../src';

@Controller()
class TestController {
  @Get('test')
  test() {
    return { result: 'ok', ret: true };
  }
}

@Module({
  imports: [LoggerModule],
  controllers: [TestController],
})
export class TestModule {}
