import * as path from 'path';
import { ID_REDIS_NAMESPACE } from '@app/demo/user/user.constant';

export default () => ({
  deploy_env: 'local',

  log_dir: path.join(__dirname, '../logs'),

  mysql: {
    type: 'sqlite',
    connections: {
      default: {},
    },
  },

  redis: {
    id: { namespace: ID_REDIS_NAMESPACE },
  },
});
