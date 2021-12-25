/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    refresh_token: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
