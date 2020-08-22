const Discord = require('discord.js');
const Database = require('better-sqlite3');
require('dotenv').config();

const constants = require('./constants/poker-constants');
const poker = require('./poker');
const dbcommands = require('./db-commands');

const client = new Discord.Client();
const db = new Database(':memory:', { verbose: console.log });

const MAX_PLAYERS = 2;

var gameState = {
  status: false,
};

const query = db.prepare(
  'CREATE TABLE profiles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);'
);
query.run();

// Login
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnected!');
});

// Start poker game
client.on('message', (msg) => {
  // const channel = msg.channel;
  if (msg.content === '!start') {
    msg.channel.send('The game will start');
    // ch.send('The game will start!\nType !play to join!')
    gameState.status = true;
    //channel.send('The game will start! \n Type !play to join!')
  }
});

// Join poker game
client.on('message', (msg) => {
  // const channel = client.channels.cache.find(ch => ch.type === 'text' && ch.name === 'general');
  // const channel = msg.channel;
  //console.log(`Before: ${gameState.status}`);
  if (msg.content === '!play') {
    if (gameState.status === true) {
      //Adds user to poker table

      let count = dbcommands.getUserCount(db);

      if (count === MAX_PLAYERS) {
        msg.channel.send('The game is full');
      }
    } else if (gameState.status === false) {
      msg.channel.send('A game hasnt started stupid');
    }
  }
});

// End poker game
client.on('message', (msg) => {
  if (msg.content === '!end') {
    gameState.status = false;
    let query = db.prepare(`DELETE FROM profiles;`);
    query.run();
  }
});

client.on('message', (msg) => {
  if (msg.content === '!poker') {
    let exists = dbcommands.profileExists(db, msg.author.username);
    if (!exists) {
      dbcommands.addProfile(db, msg.author.username);
      msg.channel.send(`Profile created for ${msg.author.username}!`);
    }
  }
});

client.on('message', (msg) => {
  if (msg.content === '!chips') {
    let chips = dbcommands.getChips(db, msg.author.username);
    msg.channel.send(`${msg.author.username} has ${chips} chips!`);
  }
});

client.on('message', (msg, value = 50) => {
  if (msg.content === '!add') {
    let exists = dbcommands.profileExists(db, msg.author.username);
    if (exists) {
      dbcommands.setChips(db, msg.author.username, value);
      msg.channel.send(`Added ${value} chips to your account!`);
    } else {
      msg.channel.send('You do not have a profile yet!');
    }
  }
});

//Sends private message to user
client.on('message', (msg) => {
  if (msg.content === '!dm') {
    msg.author.createDM().then(() => {
      const channel = client.channels.cache.find(
        (channel) =>
          channel.type === 'dm' &&
          channel.recipient.username === msg.author.username
      );
      const pokerEmbed = new Discord.MessageEmbed().setThumbnail(
        constants.ACE_OF_D
      );
      client.channels.cache.get(channel.id).send(pokerEmbed);
    });
  }
});

// Purge messages
client.on('message', (msg, value = 1) => {
  if (msg.content === '!purge') {
    console.log(msg.channel.messages.cache);
  }
});

client.login(process.env.CLIENT_ID);
