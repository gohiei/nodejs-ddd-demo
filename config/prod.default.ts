import * as path from 'path';

export default () => ({
  deploy_env: 'prod',

  log_dir: path.join(__dirname, '../logs'),

  mysql: {
    type: 'mysql',
    connections: {
      default: {
        write_dsn: 'mysql://aa:bb@127.0.0.1/cc',
        read_dsn: 'mysql://aa:bb@127.0.0.2/dd',
      },
    },
  },
});
