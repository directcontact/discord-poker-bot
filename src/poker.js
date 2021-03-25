module.exports = {
  initializeDeck(constants) {
    return new Map(Object.entries(constants));
  },

  randomCardsFromDeck(deck, number) {
    let i = 0;
    cards = [];
    while (i < number) {
      let randInt = Math.floor(Math.random() * 51);
      if (!deck[randInt]) {
        cards.push(randInt);
        deck[randInt] = true;
        i++;
      }
    }

    return cards;
  },

  getCard(card, constants) {
    let map = new Map(Object.entries(constants));
    let keys = Array.from(map.keys());
    return map.get(keys[card]);
  },
};
