const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/user',
    handler: handler.getUserHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'PUT',
    path: '/user/profile',
    handler: handler.updateProfilePhotoHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/doctors',
    handler: handler.getDoctorsHandler,
    options: {
      auth: 'chat_app',
    },
  },
  {
    method: 'GET',
    path: '/doctor/{username}',
    handler: handler.getDoctorByUsernameHandler,
    options: {
      auth: 'chat_app',
    },
  },
];

module.exports = routes;
