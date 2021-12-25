const {
  PostAuthenticationPayloadModel,
  PutAuthenticationPayloadModel,
  DeleteAuthenticationPayloadModel,
} = require('./model');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationsPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationsPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationsPayload: (payload) => {
    const validationResult = DeleteAuthenticationPayloadModel.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
