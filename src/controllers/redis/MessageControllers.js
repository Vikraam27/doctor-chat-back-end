const redis = require('redis');

class MessageControllers {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });
  }

  async postMessage(key, value) {
    return new Promise((resolve, reject) => {
      this._client.rpush(key, value, (error, ok) => {
        if (error) {
          return reject(error);
        }

        return resolve(ok);
      });
    });
  }

  async getAllMessage(key) {
    return new Promise((resolve, reject) => {
      this._client.lrange(key, 0, -1, (error, reply) => {
        if (error) {
          return reject(error);
        }

        if (reply === null) {
          return reject(new Error('room id not found'));
        }

        return resolve(reply.toString());
      });
    });
  }

  async getLastMessage(key) {
    return new Promise((resolve, reject) => {
      this._client.lrange(key, -1, -1, (error, reply) => {
        if (error) {
          return reject(error);
        }

        if (reply === null) {
          return reject(new Error('room id not found'));
        }

        if (reply.length === 0) {
          return resolve(null);
        }
        return resolve(JSON.parse(reply.toString()));
      });
    });
  }
}

module.exports = MessageControllers;
