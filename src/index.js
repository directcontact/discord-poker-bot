const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const constants = require('./constants/poker-constants');
const { initializeDeck } = require('./poker');
const dbcommands = require('./db-commands');
const { profileExists } = require('./db-commands');
const { ACE_OF_D } = require('./constants/poker-constants');
const MAX_PLAYERS = 2;

var gameState = {
  status: false,
};

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the in memory database.');
});

db.run(
  'CREATE TABLE profiles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);',
  (err) => {
    if (err) {
      return console.error(err.message);
    }

    console.log('Created table profiles!');
  }
);
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

    db.run(
      `CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);`,
      (err) => {
        if (err) {
          return console.log(err.message);
        }

        console.log('Created table users');
      }
    );
  }
});

// Join poker game
client.on('message', (msg) => {
  // const channel = client.channels.cache.find(ch => ch.type === 'text' && ch.name === 'general');
  // const channel = msg.channel;
  //console.log(`Before: ${gameState.status}`);

  if (msg.author.bot) return;

  if (msg.content === '!play') {
    if (gameState.status === true) {
      //Adds user to poker table
      db.get(`SELECT COUNT(DISTINCT name) FROM users;`, (err, num) => {
        if (err) {
          console.log(err.message);
        }

        if (num[Object.keys(num)[0]] === MAX_PLAYERS) {
          msg.channel.send('The game is full');
        } else {
          db.get(
            `SELECT * FROM users WHERE name='${msg.author.username}'`,
            (err, name) => {
              if (err) {
                console.log(err);
              }

              if (name === undefined) {
                db.run(
                  'INSERT INTO users(name, chips) VALUES (?,?)',
                  [msg.author.username, 0],
                  (err) => {
                    if (err) {
                      console.log(err);
                    }
                    msg.channel.send(
                      `(${num[Object.keys(num)[0]] + 1}/${MAX_PLAYERS}) `
                    );
                    // msg.channel.send('You are the first to join!');
                  }
                );
              } else if (name !== undefined) {
                msg.channel.send('Youre already in');
              }
            }
          );
        }
      });
    } else if (gameState.status === false) {
      msg.channel.send('A game hasnt started stupid');
    }
  }
  // console.log(`${gameState.status}`);
});

client.on('message', (msg) => {
  if (msg.content === '!count') {
    msg.reply(
      `${msg.author.username}|${dbcommands.getChips(db, msg.author.username)}`
    );
  }
});

// End poker game
client.on('message', (msg) => {
  if (msg.content === '!end') {
    gameState.status = false;

    db.run(`DELETE FROM users;`, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
  }
});

client.on('message', (msg) => {
  if (msg.content === '!poker') {
    db.get(
      `SELECT * FROM profiles WHERE name='${msg.author.username}';`,
      (err, name) => {
        if (err) {
          return console.log(err.message);
        }

        if (name === undefined) {
          db.run(
            'INSERT INTO profiles(name, chips) VALUES (?,?)',
            [msg.author.username, 0],
            (err) => {
              if (err) {
                return console.log(err.content);
              }
              msg.channel.send(`Profile created for ${msg.author.username}!`);
            }
          );
        }
      }
    );
  }
});

client.on('message', (msg) => {
  if (msg.content === '!chips') {
    db.get(
      `SELECT chips FROM profiles WHERE name='${msg.author.username}';`,
      (err, chips) => {
        if (err) {
          return console.log(err.message);
        }

        msg.channel.send(`${msg.author.username} has ${chips.chips} chips!`);
      }
    );
  }
});

client.on('message', (msg, value = 50) => {
  if (msg.content === '!add') {
    dbcommands.profileExists(db, msg.author.username).then((exists) => {
      console.log(exists);
      if (exists) {
        dbcommands.setChips(db, msg.author.username, value);
        msg.channel.send(`Added ${value} chips to your account!`);
      } else {
        msg.channel.send('You do not have a profile yet!');
      }
    });
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
      const pokerEmbed = new Discord.MessageEmbed().setThumbnail(ACE_OF_C);
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
