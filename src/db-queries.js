module.exports = {
  setChips(db, user, value, table) {
    let command = `UPDATE ${table} SET chips=? WHERE name=?;`;
    // let update = this.getChips(db, user, table) + parseInt(value);
    let query = db.prepare(command);
    query.run(value, user);
  },

  createProfileTable(db) {
    const query = db.prepare(
      'CREATE TABLE IF NOT EXISTS profiles (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);'
    );
    query.run();
  },

  createPlayerTable(db) {
    const query = db.prepare(
      'CREATE TABLE IF NOT EXISTS players (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT, chips INTEGER);'
    );
    query.run();
  },

  getChips(db, user, table) {
    let command = `SELECT chips FROM ${table} WHERE name=?;`;
    let query = db.prepare(command);
    let chips = query.get(user);
    return parseInt(chips.chips);
  },

  addChips(db, user, value, table) {
    let sum = parseInt(value) + this.getChips(db, user, table);
    let command = `UPDATE ${table} SET chips=? WHERE name=?;`;
    let query = db.prepare(command);
    query.run(sum, user);
  },

  tableEntryExists(db, user, table) {
    let command = `SELECT name FROM ${table} WHERE name=?;`;
    let query = db.prepare(command);
    const valid = query.get(user);
    return valid !== undefined;
  },

  getUserCount(db, table) {
    let command = `SELECT COUNT(DISTINCT name) FROM ${table};`;
    let query = db.prepare(command);
    const result = query.get();
    return result[Object.keys(result)[0]];
  },

  addTableEntry(db, user, table) {
    let command = `INSERT INTO ${table}(name, chips) VALUES (?,?);`;
    let query = db.prepare(command);
    query.run(user, 0);
  },

  deleteTable(db, table) {
    let command = `DELETE FROM ${table};`;
    let query = db.prepare(command);
    query.run();
  },

  getID(db, user, table) {
    let command = `SELECT id FROM ${table} WHERE name=?;`;
    let query = db.prepare(command);
    const result = query.get(user);
    return result[Object.keys(result)[0]];
  },

  removeTableEntry(db, id, table) {
    let command = `DELETE FROM ${table} WHERE id=?;`;
    let query = db.prepare(command);
    query.run(id);
  },

  listRows(db, table) {
    let players = [];
    let command = `SELECT name FROM ${table};`;
    let query = db.prepare(command);

    for (const player of query.iterate()) {
      players.push(player.name);
    }

    return players;
  },

  transferChips(db, user, value, originTable, destinationTable) {
    this.addChips(db, user, value, destinationTable);
    this.addChips(db, user, -Math.abs(value), originTable);
  },

  cashOutChips(db, users) {
    for (name of users) {
      let chips = this.getChips(db, name, 'players');
      this.transferChips(db, name, chips, 'players', 'profiles');
      console.log('Transferred ' + chips + ' to ' + name);
    }
  },
};
