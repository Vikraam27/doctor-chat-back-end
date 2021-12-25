const Joi = require('joi');

const ChatRoomModels = Joi.object({
  username: Joi.string().required(),
  participant: Joi.string().required(),
});

const MessageModels = Joi.object({
  sender: Joi.string().required(),
  message: Joi.string().required(),
  messageType: Joi.string().required(),
});

module.exports = { ChatRoomModels, MessageModels };
