const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO authentications VALUES($1, $2)',
      values: [token, createdAt],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('invalid refresh token');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsControllers;
