module.exports = {
  getChips(db, user) {
    let chipVal = 0;
    db.get(`SELECT chips FROM profiles WHERE name='${user}';`, 
    (err, chips) => {
      if (err) {
        console.log(err.message);
      }
      chipVal = chips;
    });
    console.log('Chipval: ' + chipVal)
    return chipVal;
  },

  setChips(db, user, value) {
    let update = this.getChips(db, user) + value;
    console.log('Setvalue: ' + update)
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
    let valid = 0;
    db.get(
      `SELECT name FROM profiles WHERE name='${user}';`,
      (err, name) => {
        if (err) {
          console.log(err.message);
        }
        if (name !== undefined) {
          valid = 1;
        } 
      }
    );

    // console.log(valid)
    if (valid === 1) {
      return true
    }
    else if (valid === 0) {
      return false;
    }
  },
};
