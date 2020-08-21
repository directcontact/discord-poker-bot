const Discord = require('discord.js');

var gameState = {
    status: false,
}
const fs = require('fs');
const _ = require('lodash');
const client = new Discord.Client();
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the in memory database.');
});

db.run(
  'CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, count INTEGER);',
  (err) => {
    if (err) {
      return console.error(err.message);
    }

    console.log('Created table users!');
  }
);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  const split = msg.content.split(' ');
  if (split[0] === '!avatar') {
    const users = msg.mentions.users;
    users.map((user) => {
      msg.reply(user.avatarURL());
    });
  }
});

client.on('message', (msg) => {
    if (msg.content === 'yeet') {
        msg.reply('yoot');
        console.log(msg.author.toString())
    }
})

client.on('message', (msg) => {
    // const channel = msg.channel;
    if (msg.content === '!start') {
        msg.channel.send('The game will start')
        // ch.send('The game will start!\nType !play to join!')
        gameState.status = true;

        //channel.send('The game will start! \n Type !play to join!')
    }
})

client.on('message', (msg) => {
    // const channel = client.channels.cache.find(ch => ch.type === 'text' && ch.name === 'general');
    const channel = msg.channel;
    //console.log(`Before: ${gameState.status}`);

    if (msg.author.bot) return;
    else if (msg.content === '!play') {
        if (gameState.status === true) {
            channel.send('Someone joined!');
        }
        else if (gameState.status === false) {
            channel.send('A game hasnt started stupid');
        }
    }
    // console.log(`${gameState.status}`);
})

client.on('message', (msg) => {
    if (msg.content === '!end') {
        gameState.status = false;
    }
})

client.on('message', (msg, value = 1) => {
    if (msg.content === '!purge') {
        console.log(msg.channel.messages.cache)
    }
})

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Oh god, it's ${member}`);
  });

  client.on('message', (msg) => {
    db.run(
      'INSERT INTO users(name, count) VALUES (?,?)',
      [msg.author.username, 1],
      (err) => {
        if (err) {
          console.log(err.stack);
        }
      }
    );
  });

client.on('message', (msg) => {
  if (msg.content === '!stats') {
    db.all(`SELECT * from users;`, (err, rows) => {
      if (err) {
        console.error(err.message);
      } else {
        rows.map((user) => {
          msg.reply(`${user.name} has ${user.count} replies`);
        });
      }
    });
  }
});

client.login(process.env.CLIENT_ID);
