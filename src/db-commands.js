module.exports = {
  setChips(db, user, value, table) {
    let command = `UPDATE ${table} SET chips=? WHERE name=?;`;
    // let update = this.getChips(db, user, table) + parseInt(value);
    let query = db.prepare(command);
    query.run(value, user);
  },

  getChips(db, user, table) {
    let command = `SELECT chips FROM ${table} WHERE name=?;`;
    let query = db.prepare(command);
    let chips = query.get(user);
    return parseInt(chips.chips);
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
    let command = `INSERT INTO ${table}(name, chips) VALUES (?,?);`
    let query = db.prepare(command);
    query.run(user, 0);
  },

  deleteTable(db, table) {
    let command = `DELETE FROM ${table};`;
    let query = db.prepare(command);
    query.run();
  }
};
