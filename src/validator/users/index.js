const {
  UserPayloadModels, DoctorPayloadModels, ProfilePhotoModels,
} = require('./models');
const InvariantError = require('../../exceptions/InvariantError');

const RegisterValidator = {
  validateUserModels: (payload) => {
    const validationResult = UserPayloadModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDoctorModels: (payload) => {
    const validationResult = DoctorPayloadModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateProfileUrl: (payload) => {
    const validationResult = ProfilePhotoModels.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = RegisterValidator;
