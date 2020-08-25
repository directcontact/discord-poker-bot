const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES, PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'withdraw',
  description:
    "Withdraws money from the user's bank and inserts the money into their current holding.",
  game: true,
  args: true, 
  execute(message, args, state) {
    const value = parseInt(args[0]);

    let playerExists = queries.tableEntryExists(
      db,
      message.author.username,
      PLAYERS
    );

    if (playerExists) {
      if (value > queries.getChips(db, message.author.username, PROFILES)) {
        message.reply('You dont have that many chips');
      } else if (value <= 0) {
        message.reply('why?');
      } else {
        queries.setChips(
          db,
          message.author.username,
          queries.getChips(db, message.author.username, PROFILES) - value,
          PROFILES
        );
        queries.setChips(
          db,
          message.author.username,
          queries.getChips(db, message.author.username, PLAYERS) + value,
          PLAYERS
        );
        message.reply(`Transferred ${value} chips!`);
      }
    } else {
      message.channel.send('Youre not in the game.');
    }
  },
};
