export default () => ({
  deploy_env: 'prod',

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
