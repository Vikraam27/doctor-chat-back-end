/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('doctor_profile', {
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
    str_number: {
      type: 'BIGINT',
      notNull: true,
    },
    category: {
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
  pgm.addConstraint('doctor_profile', 'fk_doctor_profile.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('doctor_profile');
};
