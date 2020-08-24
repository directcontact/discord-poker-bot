const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();
module.exports = {
  name: 'end',
  description: 'Ends the game.',
  execute(message, args) {
    gameState.status = false;
    queries.deleteTable(db, 'players');
    msg.channel.send('Game has ended');
  },
};
