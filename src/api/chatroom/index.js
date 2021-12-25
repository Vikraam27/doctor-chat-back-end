/* eslint-disable max-len */
const ChatRoomHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'chat-room',
  version: '1.0.0',
  register: async (server, {
    controllers, userControllers, validator, messageControllers,
  }) => {
    const chatRoomHandler = new ChatRoomHandler(controllers, userControllers, validator, messageControllers);
    server.route(routes(chatRoomHandler));
  },
};
