/* eslint-disable no-new-func */
/* eslint-disable max-len */
class ChatRoomHandler {
  constructor(controllers, userControllers, validator, messageControllers) {
    this._controllers = controllers;
    this._userControllers = userControllers;
    this._validator = validator;
    this._messageControllers = messageControllers;

    this.createRoomChatHandler = this.createRoomChatHandler.bind(this);
    this.getRoomsHandler = this.getRoomsHandler.bind(this);
    this.getRoomByIdHandler = this.getRoomByIdHandler.bind(this);
    this.postMessageHandler = this.postMessageHandler.bind(this);
  }

  async createRoomChatHandler(request, h) {
    try {
      await this._validator.validateChatRoomPayload(request.payload);
      const { username, participant } = request.payload;
      const verifyRoomChat = await this._controllers.verifyRoomChat(username, participant);

      if (verifyRoomChat) {
        return {
          status: 'success',
          message: 'room already created',
          data: {
            roomId: verifyRoomChat.id,
          },
        };
      }
      const roomId = await this._controllers.createRoomChat(username, participant);
      const response = h.response({
        status: 'success',
        message: 'successfully create chat room',
        data: {
          roomId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getRoomsHandler(request) {
    const { username } = request.auth.artifacts.decoded.payload;
    const datas = await this._controllers.getRooms(username);
    const data = await Promise.all(datas.map(async ({ id, creator, participant_username: participant }) => {
      const { user_type: creatorType } = await this._userControllers.getUserType(creator);
      const { user_type: participantType } = await this._userControllers.getUserType(participant);

      const { profile_url: creatorProfileUrl } = await this._userControllers.getUserProfileUrl(creatorType, creator);
      const { profile_url: participantProfileUrl } = await this._userControllers.getUserProfileUrl(participantType, participant);
      const lastMessage = await this._messageControllers.getLastMessage(id);
      return {
        id,
        creator,
        creatorProfileUrl,
        participant,
        participantProfileUrl,
        lastMessage,
      };
    }));

    return {
      status: 'success',
      data,
    };
  }

  async getRoomByIdHandler(request) {
    try {
      const { roomId } = request.params;
      const {
        id,
        creator,
        participant_username: participant,
        created_at: createdAt,
      } = await this._controllers.getRoomById(roomId);

      const { user_type: creatorType } = await this._userControllers.getUserType(creator);
      const { user_type: participantType } = await this._userControllers.getUserType(participant);

      const { profile_url: creatorProfileUrl } = await this._userControllers.getUserProfileUrl(creatorType, creator);
      const { profile_url: participantProfileUrl } = await this._userControllers.getUserProfileUrl(participantType, participant);
      const message = await this._messageControllers.getAllMessage(roomId);
      const objectStringArray = (new Function(`return [${message}];`)());

      return {
        status: 'success',
        data: {
          id,
          creator,
          creatorProfileUrl,
          participant,
          participantProfileUrl,
          createdAt,
          messages: objectStringArray,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async postMessageHandler(request, h) {
    try {
      this._validator.validateMessagePayload(request.payload);

      const { roomId } = request.params;
      const { sender, message, messageType } = request.payload;
      const timestamp = new Date().toISOString();
      const value = JSON.stringify({
        sender,
        message,
        messageType,
        timestamp,
      });
      await this._messageControllers.postMessage(roomId, value);

      const response = h.response({
        status: 'success',
        message: 'successfully send message',
        data: {
          sender,
          message,
          messageType,
          timestamp,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = ChatRoomHandler;
