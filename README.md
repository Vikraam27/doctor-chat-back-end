# ![Node/Hapi.JS/PostgreSQL/Redis chat app](https://github.com/Vikraam27/chat-application/blob/main/hapi(1).svg) Chat application using Hapi.js

# Getting started

## Install Node

Install [Node.JS LTS version](https://nodejs.org/en/download/) 

## To get the Node server running locally

- Clone this repo
- `cd /path/where/your/cloned/the/repo`
- `npm install` to install all required dependencies
- Install PostgreSQL ([instructions](https://www.postgresql.org/download/)) and run it by executing `systemctl start postgresql`
- Install Redis Stable version ([instructions](https://redis.io/download)) and run it by executing `redis-cli`
- create .env file
- Add your application configuration to your `.env` file in the root of your project:

```shell
# server configuration
HOST=localhost
PORT=5000
 
# node-postgres configuration
PGUSER=<userdb>
PGHOST=localhost
PGPASSWORD=<userpassword>
PGDATABASE=chatapp
PGPORT=5432

# JWT token
ACCESS_TOKEN_KEY=<your secret access Token>
REFRESH_TOKEN_KEY=<your secret refresh token Token>
ACCESS_TOKEN_AGE=<token age >

# Redis
REDIS_SERVER=localhost
```
- `npm run start` to start the local server with nodemon
- The API is available at `http://localhost:5000`

# Code Overview

## Dependencies

- [hapijs](https://github.com/hapijs/hapi) - The server for handling and routing HTTP requests
- [hapi/jwt](https://github.com/hapijs/jwt) - Plugin for validating JWTs for authentication
- [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) - A library to help you hash passwords
- [dotenv](https://github.com/motdotla/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
- [joi](https://github.com/sideway/joi) - schema description language and data validator for JavaScript.
- [nanoid](https://github.com/ai/nanoid) - A tiny, secure, URL-friendly, unique string ID generator for JavaScript.
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) - Node.js database migration management built exclusively for postgres. 
- [pg](https://github.com/brianc/node-postgres) - Non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.
- [redis](https://github.com/NodeRedis/node-redis) - A high performance Node.js Redis client.
- [socket.io](https://github.com/socketio/socket.io) -Socket.IO enables real-time bidirectional event-based communication
- [eslint](https://github.com/eslint/eslint) - ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. 
- [nodemon](https://github.com/remy/nodemon) - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
