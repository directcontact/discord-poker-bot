const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { PREFIX } = require('../constants/game-constants');

const client = new Discord.Client();
const state = {
  status: false,
  deck: [],
  master: '',
  big: 2,
  small: 1,
  buyIn: 100,
  river: [],
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
  // vERY iMPOrTANt ---- DONT DELETE
  if (
    (message.content.search('rework') >= 0 ||
      message.content.search('refactor') >= 0) &&
    !message.author.bot
  ) {
    message.channel.send('Did you say, rework?', {
      files: ['./images/smallgif.gif'],
    });
  }

  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
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
      reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (command.game && !state.status) {
    return message.reply('The game has not begun yet!');
  }

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

client.on('guildCreate', (guild) => {
  const channels = guild.channels.cache.filter(
    (channel) => channel.type == 'text'
  );

  let embed = new Discord.MessageEmbed()
    .setTitle("Hello! I'm Poker Bot!")
    .setDescription(
      `
        I\'m here to help you facilitate poker games!

        If you need any help, just use the **!help** command and it will list all the available commands.

        Every player will have to type **!newprofile** to create a profile with chips so that you can start to play!
      `
    );

  channels
    .first()
    .send(embed)
    .catch((e) => console.log(e));
});

client.login(process.env.CLIENT_ID);
