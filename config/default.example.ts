import path from 'path';
import { ID_REDIS_NAMESPACE } from '../src/user/user.constant';

export default () => ({
  deploy_env: 'local',

  log_dir: path.join(__dirname, '../logs'),

  mysql: {
    type: 'mysql',
    connections: {
      default: {
        write_dsn:
          'mysql://this-is-username:this-is-password@127.0.0.1:3306/this-is-database-name',
        read_dsn:
          'mysql://this-is-username:this-is-password@127.0.0.2:3306/this-is-database-name', // or array
      },
      // another: {
      //   write_dsn: 'mysql://this-is-username:this-is-password@127.0.0.1:3306/this-is-database-name',
      //   read_dsn: 'mysql://this-is-username:this-is-password@127.0.0.2:3306/this-is-database-name',
      // },
    },
  },

  redis: {
    id: {
      namespace: ID_REDIS_NAMESPACE,
      url: 'redis://127.0.0.1:6379/0',
    },
  },
});
