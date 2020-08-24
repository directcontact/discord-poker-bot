const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'withdraw',
  description:
    "Withdraws money from the user's bank and inserts the money into their current holding",
  execute(message, args, state) {
    const value = parseInt(args[0]);

    if (state.status === true) {
      let playerExists = queries.tableEntryExists(
        db,
        msg.author.username,
        PLAYERS
      );

      if (playerExists) {
        value = parseInt(args[0]);

        console.log(
          'Chips: ' + queries.getChips(db, msg.author.username, PROFILES)
        );
        if (value > queries.getChips(db, msg.author.username, PROFILES)) {
          message.reply('You dont have that many chips');
        } else if (value <= 0) {
          message.reply('why?');
        } else {
          queries.setChips(
            db,
            msg.author.username,
            queries.getChips(db, msg.author.username, PROFILES) - value,
            PROFILES
          );
          queries.setChips(
            db,
            msg.author.username,
            queries.getChips(db, msg.author.username, PLAYERS) + value,
            PLAYERS
          );
          message.reply(`Transferred ${value} chips!`);
          console.log(queries.getChips(db, msg.author.username, PLAYERS));
        }
      } else {
        message.channel.send('Youre not in the game.');
      }
    } else {
      message.channel.send('The game hasnt started yet.');
    }
  },
};
