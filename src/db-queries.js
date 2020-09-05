module.exports = {
  setChips(db, id, value, table) {
    let command = `UPDATE ${table} SET chips=? WHERE user_id=?;`;
    // let update = this.getChips(db, user, table) + parseInt(value);
    let query = db.prepare(command);
    query.run(value, id);
  },

  createProfileTable(db) {
    const query = db.prepare(
      'CREATE TABLE IF NOT EXISTS profiles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, user_id INTEGER, chips INTEGER);'
    );
    query.run();
  },

  createPlayerTable(db) {
    const query = db.prepare(
      'CREATE TABLE IF NOT EXISTS players (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, user_id INTEGER, chips INTEGER, cards TEXT);'
    );
    query.run();
  },

  setCards(db, user, cards) {
    let query = db.prepare(`UPDATE players SET cards=? WHERE user_id=?;`);
    query.run(cards.toString(), user);
  },

  getCards(db, id) {
    let query = db.prepare(`SELECT cards from players WHERE user_id=?;`);
    return query.get(id).cards;
  },

  getChips(db, id, table) {
    let command = `SELECT chips FROM ${table} WHERE user_id=?;`;
    let query = db.prepare(command);
    let chips = query.get(id);
    return parseInt(chips.chips);
  },

  addChips(db, id, value, table) {
    let sum = parseInt(value) + this.getChips(db, id, table);
    let command = `UPDATE ${table} SET chips=? WHERE user_id=?;`;
    let query = db.prepare(command);
    query.run(sum, id);
  },

  tableEntryExists(db, id, table) {
    let command = `SELECT user_id FROM ${table} WHERE user_id=?;`;
    let query = db.prepare(command);
    const valid = query.get(id);
    return valid !== undefined;
  },

  getUserCount(db, table) {
    let command = `SELECT COUNT(DISTINCT user_id) FROM ${table};`;
    let query = db.prepare(command);
    const result = query.get();
    return result[Object.keys(result)[0]];
  },

  addTableEntry(db, id, table) {
    let command = `INSERT INTO ${table}(user_id, chips) VALUES (?,?);`;
    let query = db.prepare(command);
    query.run(id, 0);
  },

  deleteTable(db, table) {
    let command = `DROP TABLE ${table};`;
    let query = db.prepare(command);
    query.run();
  },

  getID(db, id, table) {
    let command = `SELECT id FROM ${table} WHERE user_id=?;`;
    let query = db.prepare(command);
    const result = query.get(id);
    return result ? result[Object.keys(result)[0]] : 'N/A';
  },

  removeTableEntry(db, id, table) {
    let command = `DELETE FROM ${table} WHERE user_id=?;`;
    let query = db.prepare(command);
    query.run(id);
  },

  listRows(db, table) {
    let players = [];
    let command = `SELECT user_id FROM ${table};`;
    let query = db.prepare(command);

    for (const player of query.iterate()) {
      players.push(player.id);
    }

    return players;
  },

  transferChips(db, id, value, originTable, destinationTable) {
    this.addChips(db, id, value, destinationTable);
    this.addChips(db, id, -Math.abs(value), originTable);
  },

  cashOutChips(db, ids) {
    for (id of ids) {
      let chips = this.getChips(db, id, 'players');
      this.transferChips(db, id, chips, 'players', 'profiles');
      console.log('Transferred ' + chips + ' to ' + id);
    }
  },
};
