module.exports = {
  getChips(db, user) {
    let chipVal = 0;
    db.get(`SELECT chips FROM profiles WHERE name='${user}';`, (err, chips) => {
      if (err) {
        console.log(err.message);
      }
      chipVal = chips;
    });
    return chipVal;
  },

  setChips(db, user, value) {
    let update = this.getChips(db, user) + value;
    let query = db.prepare(`UPDATE profiles SET chips=? WHERE name=?;`);
    query.run(update, user);
  },

  getChips(db, user) {
    let query = db.prepare(`SELECT chips FROM profiles WHERE name=?;`);
    let chips = query.get(user);
    return chips.chips;
  },

  profileExists(db, user) {
    let query = db.prepare(`SELECT name FROM profiles WHERE name='${user}';`);
    const valid = query.get();
    return valid !== undefined;
  },

  getUserCount(db) {
    let query = db.prepare(`SELECT COUNT(DISTINCT name) FROM profiles;`);
    const result = query.get();
    return result[Object.keys(result)[0]];
  },

  addProfile(db, user) {
    let query = db.prepare('INSERT INTO profiles(name, chips) VALUES (?,?)');
    query.run([user, 0]);
  },
};
