const InvariantError = require('../../exceptions/InvariantError');
const { ProfileImageHeadersModels } = require('./models');

const ProfileImageUploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ProfileImageHeadersModels.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProfileImageUploadsValidator;
