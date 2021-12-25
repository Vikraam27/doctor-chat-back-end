const InvariantError = require('../../exceptions/InvariantError');

class UserHandler {
  constructor(controllers, validator) {
    this._validator = validator;
    this._controllers = controllers;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserHandler = this.getUserHandler.bind(this);
    this.updateProfilePhotoHandler = this.updateProfilePhotoHandler.bind(this);
    this.getDoctorsHandler = this.getDoctorsHandler.bind(this);
    this.getDoctorByUsernameHandler = this.getDoctorByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      if (request.payload.userType === 'doctor') {
        this._validator.validateDoctorModels(request.payload);

        const {
          username, password, fullname, userType, gender, strNum, category,
        } = request.payload;
        const createdAt = new Date().toISOString();

        const userId = await this._controllers.addUser({
          username, password, userType, createdAt,
        });
        await this._controllers.addDoctorProfile({
          userId, username, fullname, userType, gender, strNum, category, createdAt,
        });

        const response = h.response({
          status: 'success',
          message: 'successfully registered user',
          statusCode: 201,
          data: {
            userId,
          },
        });
        response.code(201);
        return response;
      }
      if (request.payload.userType === 'patients') {
        this._validator.validateUserModels(request.payload);
        const {
          username, password, fullname, userType, gender,
        } = request.payload;
        const createdAt = new Date().toISOString();

        const userId = await this._controllers.addUser({
          username, password, userType, createdAt,
        });
        await this._controllers.addUserProfile({
          userId, username, fullname, userType, gender, createdAt,
        });

        const response = h.response({
          status: 'success',
          message: 'successfully registered user',
          statusCode: 201,
          data: {
            userId,
          },
        });
        response.code(201);
        return response;
      }

      throw new InvariantError('invalid user type');
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async getUserHandler(request) {
    try {
      const { id } = request.auth.credentials;
      const { userType } = request.auth.artifacts.decoded.payload;

      if (userType === 'doctor') {
        const data = await this._controllers.getDoctorInfo(id);

        return {
          status: 'success',
          data,
        };
      }

      if (userType === 'patients') {
        const data = await this._controllers.getUserInfo(id);

        return {
          status: 'success',
          data,
        };
      }
      throw new InvariantError('invalid user type');
    } catch (error) {
      return error;
    }
  }

  async updateProfilePhotoHandler(request) {
    try {
      this._validator.validateProfileUrl(request.payload);
      const { id } = request.auth.credentials;
      const { userType } = request.auth.artifacts.decoded.payload;
      const { profileUrl } = request.payload;

      if (userType === 'doctor') {
        const data = await this._controllers.putDoctorProfilePhoto(id, profileUrl);

        return {
          status: 'success',
          data,
        };
      }

      if (userType === 'patients') {
        const data = await this._controllers.putUserProfilePhoto(id, profileUrl);

        return {
          status: 'success',
          data,
        };
      }
      throw new InvariantError('invalid user type');
    } catch (error) {
      return error;
    }
  }

  async getDoctorsHandler() {
    const data = await this._controllers.getDoctors();

    return {
      status: 'success',
      data,
    };
  }

  async getDoctorByUsernameHandler(request) {
    try {
      const { username } = request.params;
      const data = await this._controllers.getDoctorByUsername(username);

      return {
        status: 'success',
        data,
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UserHandler;
