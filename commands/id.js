const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: '',
  description: '',
  execute(message, args) {
    console.log(
      'Profiles: ' + queries.getID(db, msg.author.username, PROFILES)
    );
    console.log('Players: ' + queries.getID(db, msg.author.username, PLAYERS));
  },
};
