class AuthenticationsHandler {
  constructor(authenticationsControllers, userControllers, tokenManager, validator) {
    this._authenticationsControllers = authenticationsControllers;
    this._userControllers = userControllers;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationsPayload(request.payload);
      const { username, password } = request.payload;
      const { id, userType } = await this._userControllers.verifyUserCredential(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id, username, userType });
      const refreshToken = this._tokenManager.generateRefreshToken({ id, username, userType });

      await this._authenticationsControllers.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        statusCode: 201,
        message: 'successfully login',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async putAuthenticationHandler(request) {
    try {
      this._validator.validatePutAuthenticationsPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsControllers.verifyRefreshToken(refreshToken);
      const { id, username, userType } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id, username, userType });

      return {
        status: 'success',
        statusCode: 200,
        message: 'successfully update the token',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationsPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsControllers.verifyRefreshToken(refreshToken);
    await this._authenticationsControllers.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      statusCode: 200,
      message: 'successfully deleted refresh token',
    };
  }
}

module.exports = AuthenticationsHandler;
