module.exports = {
  initializeDeck(constants) {
    return new Map(Object.entries(constants));
  },

  removeCardFromDeck(deck, cardToRemove) {
    deck.delete(cardToRemove);
  },
};
