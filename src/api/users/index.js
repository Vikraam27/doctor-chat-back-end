const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { controllers, validator }) => {
    const userHandler = new UserHandler(controllers, validator);
    server.route(routes(userHandler));
  },
};
