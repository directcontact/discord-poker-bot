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
    msg.channel.send('Here are the first three for the river.', {
      files: pokercommands.removeRandomCardsFromDeck(deck, 3),
    });
  },
};
