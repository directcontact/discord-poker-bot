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
const PROFILES = 'profiles';
const PLAYERS = 'players';
const PREFIX = '!';

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


client.on('message', (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(PREFIX)) return;

  const args = msg.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'poker') {
    let exists = dbcommands.tableEntryExists(db, msg.author.username, PROFILES);
    if (!exists) {
      dbcommands.addTableEntry(db, msg.author.username, PROFILES);
      msg.channel.send(`Profile created for ${msg.author.username}!`);
    }
    else {
      msg.channel.send('Profile already exists.');
    }
  }

  if (command === 'start') {
    msg.channel.send('The game will start');
    gameState.status = true;
    dbcommands.createPlayerTable(db);
  }

  if (command === 'play') {
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

  if (command === 'end') {
    gameState.status = false;
    pot = 0;
    dbcommands.cashOutChips(db, dbcommands.listPlayers(db, PLAYERS))
    dbcommands.deleteTable(db, PLAYERS)
    msg.channel.send('Game has ended');
  }

  if (command === 'add') {
    let value = 50;
    if (args.length !== 0) {
      value = parseInt(args[0]);
    }
    let exists = dbcommands.tableEntryExists(db, msg.author.username, PROFILES);
    if (exists) {
      dbcommands.addChips(db, msg.author.username, value, PROFILES);
      msg.channel.send(`Added ${value} chips to your account!`);
    } else {
      msg.channel.send('You do not have a profile yet!');
    }
  }

  if (command === 'bank') {
    if (dbcommands.tableEntryExists(db, msg.author.username, PROFILES)) {
      let chips = dbcommands.getChips(db, msg.author.username, PROFILES);
      msg.reply(`You have ${chips} chips in the bank!`);
    }
    else {
      msg.send('You dont have a profile yet.')
    }
  }

  if (command === 'withdraw') {
    let value = 20;

    if (gameState.status === true) {
      let playerExists = dbcommands.tableEntryExists(db, msg.author.username, PLAYERS);

      if (playerExists) {      
        if (args.length !== 0) {
          value = parseInt(args[0]);
        }
  
        if (value > dbcommands.getChips(db, msg.author.username, PROFILES)) {
          msg.reply('You dont have that many chips');
        }
        else if (value <= 0) {
          msg.reply('why?');
        }
        else {
          dbcommands.transferChips(db, msg.author.username, value, PROFILES, PLAYERS);
          // dbcommands.setChips(db, msg.author.username, dbcommands.getChips(db, msg.author.username, PROFILES) - value, PROFILES);
          // dbcommands.setChips(db, msg.author.username, dbcommands.getChips(db, msg.author.username, PLAYERS) + value, PLAYERS);
          msg.reply(`Transferred ${value} chips!`)
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

  if (command === 'chips') {
    if (gameState.status === true) {
      let chips = dbcommands.getChips(db, msg.author.username, PLAYERS);
      msg.reply(`You have ${chips} chips!`)
    }
    else {
      msg.channel.send('Game hasnt started')
    }
  }

  if (command === 'dm') {
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

  if (command === 'deal') {
    msg.channel.send('Here are the first three for the river.', {
      files: pokercommands.removeRandomCardsFromDeck(deck, 3),
    });
  }

  if (command === 'quit') {
    if (dbcommands.tableEntryExists(db, msg.author.username, PLAYERS)) {
      let playerID = dbcommands.getID(db, msg.author.username, PLAYERS);
      dbcommands.removeTableEntry(db, playerID, PLAYERS);
      msg.channel.send(`${msg.author.username} has left the table.`);
    }
    else {
      msg.channel.send('Youre not in the game.');
    }
  }

  if (command === 'id') {
    console.log('Profiles: ' + dbcommands.getID(db, msg.author.username, PROFILES));
    console.log('Players: ' + dbcommands.getID(db, msg.author.username, PLAYERS));
  }

  if (command === 'list') {
    let players = dbcommands.listPlayers(db, PROFILES);
    
    for (let i = 0; i < players.length; i++) {
      msg.channel.send((i + 1) + '. ' + players[i]);
    }
  }

  if (command === 'purge') {
    const deleteNum = parseInt(args[0]);

    if (!deleteNum || deleteNum < 2 || deleteNum > 100) {
      return msg.reply('Enter a number between 1 and 99');
    }

    msg.channel.bulkDelete(deleteNum + 1)
      .catch(err => {
        console.log(err);
      })
  }

  // if (command === 'l') {
  //   let textChannels = client.channels.cache.filter(ch => ch.type === 'text');

  //   for (const channel of textChannels) {
  //     const messages = channel[1].messages.cache;
  //     for (const message of messages) {
  //       console.log(message.author.username);
  //     }
  //   }
  // }
});

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
