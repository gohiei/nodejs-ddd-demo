import { WinstonModule } from 'nest-winston';
import * as Winston from 'winston';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  ACCESS_LOGGER,
  POST_LOGGER,
  ERROR_LOGGER,
  HTTP_REQUEST_LOGGER,
} from '../../logger.constant';

const createFactory = (name) => async (config: ConfigService) => {
  const logDir = config.get('log_dir');

  await fs.mkdir(logDir).catch(() => 0);

  const filename = path.join(logDir, '/', name);

  return WinstonModule.createLogger({
    level: 'info',
    format: Winston.format.combine(
      Winston.format.splat(),
      Winston.format.simple(),
    ),
    transports: [new Winston.transports.File({ filename })],
  });
};

export const loggerProviders = [
  {
    provide: ACCESS_LOGGER,
    useFactory: createFactory('access.log'),
    inject: [ConfigService],
  },

  {
    provide: POST_LOGGER,
    useFactory: createFactory('post.log'),
    inject: [ConfigService],
  },

  {
    provide: ERROR_LOGGER,
    useFactory: createFactory('error.log'),
    inject: [ConfigService],
  },

  {
    provide: HTTP_REQUEST_LOGGER,
    useFactory: createFactory('http_request.log'),
    inject: [ConfigService],
  },
];
