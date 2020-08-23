const Discord = require('discord.js');
const Database = require('better-sqlite3');
require('dotenv').config();

const constants = require('./constants/poker-constants');
const pokercommands = require('./poker');
const queries = require('./db-queries');
const { createProfileTable } = require('./db-queries');

const client = new Discord.Client();
const db = new Database(':memory:', { verbose: console.log });

const MAX_PLAYERS = 2;

let deck = pokercommands.initializeDeck(constants);

var gameState = {
  status: false,
};

// Login
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  createProfileTable(db);
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
      let count = queries.getUserCount(db);

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
  if (msg.content === '!newprofile') {
    let exists = queries.profileExists(db, msg.author.username);
    if (!exists) {
      queries.addProfile(db, msg.author.username);
      msg.channel.send(`Profile created for ${msg.author.username}!`);
    }
  }
});

client.on('message', (msg) => {
  if (msg.content === '!chips') {
    let exists = queries.profileExists(db, msg.author.username);
    if (exists) {
      let chips = queries.getChips(db, msg.author.username);
      msg.channel.send(`${msg.author.username} has ${chips} chips!`);
    } else {
      msg.channel.send('You do not have a profile yet!');
    }
  }
});

client.on('message', (msg, value = 50) => {
  if (msg.content === '!add') {
    let exists = queries.profileExists(db, msg.author.username);
    if (exists) {
      queries.setChips(db, msg.author.username, value);
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

      client.channels.cache.get(channel.id).send('Here are your cards!', {
        files: pokercommands.removeRandomCardsFromDeck(deck, 2),
      });
    });
  }
});

client.on('message', (msg) => {
  if (msg.content === '!deal') {
    msg.channel.send('Here are the first three for the river.', {
      files: pokercommands.removeRandomCardsFromDeck(deck, 3),
    });
  }
});

// Purge messages
client.on('message', (msg, value = 1) => {
  if (msg.content === '!purge') {
    console.log(msg.channel.messages.cache);
  }
});

client.on('message', (msg) => {
  if (msg.author.bot) return;
  if (
    msg.content.search('rework') >= 0 ||
    msg.content.search('refactor') >= 0
  ) {
    msg.channel.send('Did you say, rework?', {
      files: ['./images/smallgif.gif'],
    });
  }
});

client.login(process.env.CLIENT_ID);
