/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('chat_room', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    creator: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('chat_room', 'fk_chat_room.creator_users.username', 'FOREIGN KEY(creator) REFERENCES users(username) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('chat_room', 'fk_chat_room.creator_users.username');
  pgm.dropTable('chat_room');
};
