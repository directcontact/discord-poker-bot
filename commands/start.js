const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: 'start',
  description: 'Begins the game, starts up and initializes all values.',
  execute(message) {
    message.channel.send('The game will start');
    queries.createPlayerTable(db);
    queries.createProfileTable(db);
  },
};
