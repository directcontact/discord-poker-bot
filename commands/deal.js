const pokercommands = require('../src/poker');
const constants = require('../constants/poker-constants');
const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'deal',
  description: 'Starts the game and deals cards out to the players.',
  game: true,
  async execute(message, args, state) {
    let hand = pokercommands.randomCardsFromDeck(state.deck, 2);
    queries.setCards(db, message.author.id, hand);
    let files = [];
    hand.map((card) => {
      files.push(pokercommands.getCard(card, constants));
    });

    message.author.send('Here are your cards!', {
      files: files,
    });

    let river = pokercommands.randomCardsFromDeck(state.deck, 3);
    files = [];
    river.map((card) => {
      files.push(pokercommands.getCard(card, constants));
    });

    message.channel.send('Here are the first three for the river.', {
      files: files,
    });

    console.log(state.deck);
  },
};
