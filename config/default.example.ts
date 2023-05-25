export default () => ({
  deploy_env: 'local',

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
});