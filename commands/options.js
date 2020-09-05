module.exports = {
  name: 'options',
  description: 'Allows the user to change the options of the game.',
  game: true,
  args: true,
  usage: '[command big small buyIn]',
  execute(message, args, state) {
    if (message.author.id === state.master) {
      if (args.length === 3) {
        try {
          state.big = parseInt(args[0]);
          state.small = parseInt(args[1]);
          state.buyIn = parseInt(args[2]);
        } catch (e) {
          message.reply('Please use numbers only when assigning the settings.');
        }

        message.reply(`Your settings have been set as the following: 
        Big: ${state.big}
        Small: ${state.small}
        Buy-in: ${state.buyIn}`);
      } else {
        message.reply('Please provide all of the necessary settings.');
      }
    }
  },
};
