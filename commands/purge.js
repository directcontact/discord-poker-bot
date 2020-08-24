const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

module.exports = {
  name: 'purge',
  description: 'Purges the chat of the messages.',
  execute(message, args) {
    const deleteNum = parseInt(args[0]);

    if (!deleteNum || deleteNum < 2 || deleteNum > 100) {
      return message.reply('Enter a number between 1 and 99');
    }

    message.channel.bulkDelete(deleteNum + 1).catch((err) => {
      console.log(err);
    });
  },
};
