const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

const { prefix, token } = require('../config.json');

const client = new Discord.Client();
const state = {
  status: false,
  decks: [],
  numberOfDecks: 1,
};

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

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

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.resolve(`./commands/${file}`));
  client.commands.set(command.name, command);
}

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // vERY iMPOrTANt ---- DONT DELETE
  if (
    message.content.search('rework') >= 0 ||
    message.content.search('refactor') >= 0
  ) {
    message.channel.send('Did you say, rework?', {
      files: ['./images/smallgif.gif'],
    });
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (commandName !== 'start' && !state.status) {
    return message.reply('The game has not begun yet!');
  }

  console.log(args);

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args, state);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(token);

/*
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

  if (command === 'l') {
    let textChannels = client.channels.cache.filter(ch => ch.type === 'text');

    for (const channel of textChannels) {
      const messages = channel[1].messages.cache;
      for (const message of messages) {
        console.log(message.author.username);
      }
    }
  }
});
*/
