require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// user
const users = require('./api/users');
const UserControllers = require('./controllers/UserControllers');
const UserValidator = require('./validator/users');

// authentication
const authentications = require('./api/authentications');
const AuthenticationsControllers = require('./controllers/AuthenticationsControllers');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// uploads
const uploads = require('./api/uploads');
const StorageControllers = require('./controllers/storageControllers');
const UploadsValidator = require('./validator/uploadImage');

// chat room
const chatRoom = require('./api/chatroom');
const ChatRoomControllers = require('./controllers/ChatRoomControllers');
const ChatRoomValidator = require('./validator/chatroom');
const MessageControllers = require('./controllers/redis/MessageControllers');

// exception
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const messageControllers = new MessageControllers();
  const userControllers = new UserControllers();
  const authenticationsControllers = new AuthenticationsControllers();
  const storageControllers = new StorageControllers(path.resolve(__dirname, 'api/uploads/file/images'));
  const chatRoomControllers = new ChatRoomControllers();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // jwt proctected routes
  server.auth.strategy('chat_app', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        controllers: userControllers,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsControllers,
        userControllers,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageControllers,
        validator: UploadsValidator,
      },
    },
    {
      plugin: chatRoom,
      options: {
        controllers: chatRoomControllers,
        userControllers,
        validator: ChatRoomValidator,
        messageControllers,
      },
    },
  ]);

  await server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const ClientErrorResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      ClientErrorResponse.code(response.statusCode);
      return ClientErrorResponse;
    }

    const serverError = h.response({
      status: 'error',
      statusCode: 500,
      message: 'sorry server is down',
    });
    serverError.code(500);
    return response.continue || response;
  });

  // eslint-disable-next-line global-require
  const io = require('socket.io')(server.listener, {
    cors: {
      origin: server.info.uri,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('chatMsg', ({
      roomId, sender, message, messageType, timestamp,
    }) => {
      io.to(roomId).emit('msg', ({
        sender, message, messageType, timestamp,
      }));
    });

    socket.on('disconnect', () => {
      console.log('disconect');
    });
  });

  await server.start();
  console.log(`server running on ${server.info.uri}`);
};

init();
