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
    db.run(
      `UPDATE profiles SET chips='${update}' WHERE name='${user}';`,
      (err) => {
        if (err) {
          return console.log(err.message);
        }
      }
    );
  },

  async profileExists(db, user) {
    let valid = false;
    await db.get(
      `SELECT name FROM profiles WHERE name='${user}';`,
      (err, name) => {
        if (err) {
          console.log(err.message);
        }
        if (name !== undefined) {
          valid = true;
        }
      }
    );

    return valid;
  },
};
