const Joi = require('joi');

const PostAuthenticationPayloadModel = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadModel = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadModel = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadModel,
  PutAuthenticationPayloadModel,
  DeleteAuthenticationPayloadModel,
};
