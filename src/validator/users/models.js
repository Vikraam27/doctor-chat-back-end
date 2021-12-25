const Joi = require('joi');

const UserPayloadModels = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  userType: Joi.string().required(),
  gender: Joi.string().required(),
});

const DoctorPayloadModels = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  userType: Joi.string().required(),
  gender: Joi.string().required(),
  strNum: Joi.number().required(),
  category: Joi.string().required(),
});

const ProfilePhotoModels = Joi.object({
  profileUrl: Joi.string().required(),
});

module.exports = {
  UserPayloadModels, DoctorPayloadModels, ProfilePhotoModels,
};
