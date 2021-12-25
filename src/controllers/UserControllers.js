const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { hash, compare } = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UserControllers {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    username, password, userType, createdAt,
  }) {
    await this.verifyUsername(username);
    const userId = `user-${nanoid(10)}`;
    const hashPassword = await hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [userId, username, userType, hashPassword, createdAt],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('Unable to register user');
    }

    return result.rows[0].id;
  }

  async addUserProfile({
    userId, username, fullname, userType, gender, createdAt,
  }) {
    const query = {
      text: `INSERT INTO user_profile
      (user_id, username, fullname, user_type, gender, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING user_id`,
      values: [userId, username, fullname, userType, gender, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('Unable to register user');
    }
  }

  async addDoctorProfile({
    userId, username, fullname, userType, gender, strNum, category, createdAt,
  }) {
    const query = {
      text: `INSERT INTO doctor_profile 
      (user_id, username, fullname, user_type, gender, str_number, category, created_at, updated_at) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id`,
      values: [userId, username, fullname, userType,
        gender, strNum, category, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('Unable to register user');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, user_type, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError('Invalid username');
    }

    const { id, user_type: userType, password: hashedPassword } = result.rows[0];

    const match = await compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('invalid password');
    }

    return { id, userType };
  }

  async getUserInfo(userId) {
    const query = {
      text: `SELECT user_id, username, fullname, user_type, profile_url, gender 
      FROM user_profile WHERE user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    return result.rows[0];
  }

  async getDoctorInfo(userId) {
    const query = {
      text: `SELECT user_id, username, fullname, user_type, profile_url, gender, str_number, category
      FROM doctor_profile WHERE user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    return result.rows[0];
  }

  async putUserProfilePhoto(userId, profileUrl) {
    const updated = new Date().toISOString();
    const query = {
      text: 'UPDATE user_profile SET profile_url = $1, updated_at = $2 WHERE user_id = $3 RETURNING profile_url',
      values: [profileUrl, updated, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('cant update profile photo');
    }

    return result.rows[0];
  }

  async putDoctorProfilePhoto(userId, profileUrl) {
    const updated = new Date().toISOString();
    const query = {
      text: 'UPDATE doctor_profile SET profile_url = $1, updated_at = $2 WHERE user_id = $3 RETURNING profile_url',
      values: [profileUrl, updated, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw InvariantError('cant update profile photo');
    }

    return result.rows[0];
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Username already taken');
    }
  }

  async getDoctors() {
    const query = {
      text: 'SELECT username, fullname, profile_url, category FROM doctor_profile',
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getDoctorByUsername(username) {
    const query = {
      text: `SELECT username, fullname, profile_url, gender, str_number, category
      FROM doctor_profile WHERE username = $1`,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('doctor not found');
    }

    return result.rows[0];
  }

  async getUserType(username) {
    const query = {
      text: 'SELECT user_type FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    return result.rows[0];
  }

  async getPatienProfileUrl(username) {
    const query = {
      text: 'SELECT profile_url FROM user_profile WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getDoctorProfileUrl(username) {
    const query = {
      text: 'SELECT profile_url FROM doctor_profile WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getUserProfileUrl(userType, username) {
    if (userType === 'doctor') {
      const profileUrl = await this.getDoctorProfileUrl(username);

      return profileUrl;
    }
    if (userType === 'patients') {
      const profileUrl = await this.getPatienProfileUrl(username);

      return profileUrl;
    }
    throw new InvariantError('invalid usertyoe');
  }
}

module.exports = UserControllers;
