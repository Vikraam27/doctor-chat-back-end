/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('room_participant', {
    room_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    participant_username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('room_participant', 'fk_room_participant.room_id_chat_room.id', 'FOREIGN KEY(room_id) REFERENCES chat_room(id) ON DELETE CASCADE');
  pgm.addConstraint('room_participant', 'fk_room_participant.participant_username_users.username', 'FOREIGN KEY(participant_username) REFERENCES users(username) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('room_participant', 'fk_room_participant.room_id_chat_room.id');
  pgm.dropConstraint('room_participant', 'fk_room_participant.participant_username_users.username');
  pgm.dropTable('room_participant');
};
