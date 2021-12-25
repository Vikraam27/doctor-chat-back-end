const InvariantError = require('../../exceptions/InvariantError');
const { ChatRoomModels, MessageModels } = require('./models');

const ChatRoomValidator = {
  validateChatRoomPayload: (payload) => {
    const validationResult = ChatRoomModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateMessagePayload: (payload) => {
    const validationResult = MessageModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ChatRoomValidator;
