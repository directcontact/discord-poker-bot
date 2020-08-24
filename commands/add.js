const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'add',
  description: 'Adds chips to the user',
  execute(message, args, state) {
    let exists = queries.tableEntryExists(
      db,
      message.author.username,
      'profiles'
    );
    if (exists) {
      queries.setChips(db, message.author.username, 50, 'profiles');
      message.channel.send(`Added 50 chips to your account!`);
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
