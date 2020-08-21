const Discord = require('discord.js');
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
  'CREATE TABLE users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);',
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
