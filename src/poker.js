module.exports = {
  initializeDeck(constants) {
    return new Map(Object.entries(constants));
  },

  removeRandomCardsFromDeck(deck, number) {
    let cards = [];
    let keys = Array.from(deck.keys());

    for (let i = 0; i < number; i++) {
      let randInt = Math.floor(Math.random() * keys.length - 1);
      cards.push(deck.get(keys[randInt]));
      deck.delete(keys[randInt]);
    }

    return cards;
  },
};
