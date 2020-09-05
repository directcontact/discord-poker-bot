const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'add',
  description: 'Adds chips to the user',
  args: true,
  game: true,
  execute(message, args, state) {
    const value = parseInt(args[0]);

    let exists = queries.tableEntryExists(
      db,
      message.author.username,
      'profiles'
    );
    if (exists) {
      queries.addChips(db, message.author.id, value, 'profiles');
      message.channel.send(`Added ${value} chips to your account!`);
    } else {
      message.channel.send('You do not have a profile yet!');
    }
  },
};
