export default () => ({
  deploy_env: 'local',

  mysql: {
    type: 'sqlite',
    connections: {
      default: {},
    },
  },
});
