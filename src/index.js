const Discord = require('discord.js');
const Database = require('better-sqlite3');
require('dotenv').config();

const constants = require('./constants/poker-constants');
const pokercommands = require('./poker-commands');
const dbcommands = require('./db-commands');
const { tableEntryExists } = require('./db-commands');
const { createProfileTable } = require('./db-commands');

const client = new Discord.Client();
const db = new Database(':memory:', { verbose: console.log });

const MAX_PLAYERS = 2;
const PROFILES = 'profiles'
const PLAYERS = 'players'

let deck = pokercommands.initializeDeck(constants);

var gameState = {
  status: false,
};
let pot = 0;

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
  if (msg.content === '!start') {
    msg.channel.send('The game will start');
    gameState.status = true;
    dbcommands.createPlayerTable(db);
  }
});

// Join poker game
client.on('message', (msg) => {
  if (msg.content === '!play') {
    if (gameState.status === true) {
      if (tableEntryExists(db, msg.author.username, PROFILES)) {
        let count = dbcommands.getUserCount(db, PLAYERS);

        if (count === MAX_PLAYERS) {
          msg.channel.send('The game is full');
        }
        else {
          if (dbcommands.tableEntryExists(db, msg.author.username, PLAYERS)) {
            msg.channel.send('Youre already in')
          }
          else {
            dbcommands.addTableEntry(db, msg.author.username, PLAYERS);
            console.log('Chips: ' + dbcommands.getChips(db, msg.author.username, PLAYERS))
            msg.channel.send(`(${count + 1}/${MAX_PLAYERS}) ${msg.author.username} has joined!\nType !play to join!`);
          }
        }
      }
      else {
        msg.channel.send('You dont have a profile');
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
    pot = 0;2
    dbcommands.deleteTable(db, PLAYERS)
    msg.channel.send('Game has ended');
  }
});

client.on('message', (msg) => {
  if (msg.content === '!poker') {
    let exists = dbcommands.tableEntryExists(db, msg.author.username, PROFILES);
    if (!exists) {
      dbcommands.addTableEntry(db, msg.author.username, PROFILES);
      msg.channel.send(`Profile created for ${msg.author.username}!`);
    }
    else {
      msg.channel.send('Profile already exists.');
    }
  }
});

client.on('message', (msg) => {
  if (msg.content === '!bank') {
    if (dbcommands.tableEntryExists(db, msg.author.username, PROFILES)) {
      let chips = dbcommands.getChips(db, msg.author.username, PROFILES);
      msg.reply(`You have ${chips} chips in the bank!`);
    }
    else {
      msg.send('You dont have a profile yet.')
    }
  }
});

client.on('message', (msg, value = 50) => {
  if (msg.content === '!add') {
    let exists = dbcommands.tableEntryExists(db, msg.author.username, PROFILES);
    if (exists) {
      dbcommands.setChips(db, msg.author.username, value, PROFILES);
      msg.channel.send(`Added ${value} chips to your account!`);
    } else {
      msg.channel.send('You do not have a profile yet!');
    }
  }
});

client.on('message', (msg, value = 20) => {
  const withdraw = '!withdraw';
  if (msg.content.startsWith(withdraw)) {
    const args = msg.content.slice(withdraw.length).trim().split(" ");
    if (args[0] != '') {
      value = parseInt(args[0]);
    }

    if (gameState.status === true) {
      let playerExists = dbcommands.tableEntryExists(db, msg.author.username, PLAYERS);

      if (playerExists) {
        const args = msg.content.slice(withdraw.length).trim().split(" ");
      
        if (args[0] != '') {
          value = parseInt(args[0]);
        }
  
        console.log('Chips: ' + dbcommands.getChips(db, msg.author.username, PROFILES));
        if (value > dbcommands.getChips(db, msg.author.username, PROFILES)) {
          msg.reply('You dont have that many chips');
        }
        else if (value <= 0) {
          msg.reply('why?');
        }
        else {
          dbcommands.setChips(db, msg.author.username, dbcommands.getChips(db, msg.author.username, PROFILES) - value, PROFILES);
          dbcommands.setChips(db, msg.author.username, dbcommands.getChips(db, msg.author.username, PLAYERS) + value, PLAYERS);
          msg.reply(`Transferred ${value} chips!`)
          console.log(dbcommands.getChips(db, msg.author.username, PLAYERS));
        }
      }
      else {
        msg.channel.send('Youre not in the game.')
      }
    }
    else {
      msg.channel.send('The game hasnt started yet.');
    }
  }
})

client.on('message', (msg) => {
  if (msg.content === '!chips') {
    let chips = dbcommands.getChips(db, msg.author.username, PLAYERS);
    msg.reply(`You have ${chips} chips!`)
  }
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
})

client.on('message', (msg) => {
  if (msg.content === '!quit') {
    if (dbcommands.tableEntryExists(db, msg.author.username, PLAYERS)) {
      let playerID = dbcommands.getID(db, msg.author.username, PLAYERS);
      dbcommands.removeTableEntry(db, playerID, PLAYERS);
      msg.channel.send(`${msg.author.username} has left the table.`);
    }
    else {
      msg.channel.send('Youre not in the game.');
    }
  }
})

client.on('message', (msg) => {
  if (msg.content === '!id') {
    console.log('Profiles: ' + dbcommands.getID(db, msg.author.username, PROFILES));
    console.log('Players: ' + dbcommands.getID(db, msg.author.username, PLAYERS));
  }
  if (msg.content === '!list') {
    let players = dbcommands.listPlayers(db, PROFILES);
    
    for (let i = 0; i < players.length; i++) {
      msg.channel.send((i + 1) + '. ' + players[i]);
    }
  }
})

// vERY iMPOrTANt ---- DONT DELETE
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
