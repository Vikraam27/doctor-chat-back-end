const routes = (handler) => [
  {
    method: 'POST',
    path: '/room',
    handler: handler.createRoomChatHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/rooms',
    handler: handler.getRoomsHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/room/{roomId}',
    handler: handler.getRoomByIdHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'POST',
    path: '/room/{roomId}/message',
    handler: handler.postMessageHandler,
    options: {
      auth: 'chat_app',
    },
  },
];

module.exports = routes;
