/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_profile', {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    username: {
      type: 'TEXT',
      notNull: true,
      unique: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
    user_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    profile_url: {
      type: 'TEXT',
      notNull: false,
    },
    gender: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint('user_profile', 'fk_user_profile.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('user_profile');
};
