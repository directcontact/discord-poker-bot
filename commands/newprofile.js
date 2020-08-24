const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'newprofile',
  description: 'Creates a new profile for the author of the message.',
  execute(message) {
    let exists = queries.profileExists(db, msg.author.username);
    if (!exists) {
      queries.addProfile(db, msg.author.username);
      message.channel.send(`Profile created for ${msg.author.username}!`);
    } else {
      message.channel.send('Profile already exists.');
    }
  },
};
