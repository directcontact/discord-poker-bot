const pokercommands = require('../src/poker');

module.exports = {
  name: 'deal',
  description: 'Deals three cards to the river.',
  execute(message) {
    message.channel.send('Here are the first three for the river.', {
      files: pokercommands.removeRandomCardsFromDeck(deck, 3),
    });
  },
};
