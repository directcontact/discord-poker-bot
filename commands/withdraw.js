const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES, PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'withdraw',
  description:
    "Withdraws money from the user's bank and inserts the money into their current holding.",
  args: true,
  game: true,
  execute(message, args, state) {
    const value = parseInt(args[0]);

    let playerExists = queries.tableEntryExists(db, message.author.id, PLAYERS);

    if (playerExists) {
      console.log(
        'Chips: ' + queries.getChips(db, message.author.id, PROFILES)
      );
      if (value > queries.getChips(db, message.author.id, PROFILES)) {
        message.reply('You dont have that many chips');
      } else if (value <= 0) {
        message.reply('why?');
      } else {
        queries.setChips(
          db,
          message.author.id,
          queries.getChips(db, message.author.id, PROFILES) - value,
          PROFILES
        );
        queries.setChips(
          db,
          message.author.id,
          queries.getChips(db, message.author.id, PLAYERS) + value,
          PLAYERS
        );
        message.reply(`Transferred ${value} chips!`);
      }
    } else {
      message.channel.send('Youre not in the game.');
    }
  },
};
