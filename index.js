const Discord = require('discord.js');
const client = new Discord.Client();

var gameState = {
    status: false,
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
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

client.login('NzQ1ODEzODU5MjE4MDk2MTM4.Xz3PSA.gS13MMXXoGseTOVPGimKjhXZUYA');