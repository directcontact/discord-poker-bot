const Discord = require('discord.js');

module.exports = {
  name: 'test',
  description: 'Debug command.',
  game: false,
  execute(message, args, state) {
    let embed = new Discord.MessageEmbed()
      .setTitle("Hello! I'm Poker Bot!")
      .setDescription(
        `
          I\'m here to help you facilitate poker games!

          If you need any help, just use the **!help** command and it will list all the available commands.

          Every player will have to type **!newprofile** to create a profile with chips so that you can start to play!
        `
      );
    message.channel.send(embed);
  },
};
