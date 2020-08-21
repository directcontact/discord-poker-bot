module.exports = {
  getChips(db, user) {
    let chipVal = 0;
    db.get(
      `SELECT chips FROM profiles WHERE name='${user}';`,
      (err, chips) => {
        if (err) {
          console.log(err.message);
        }
        // console.log(`Chips: ${chips.chips}`);
        chipVal = chips;
      }
    )
    return chipVal;
  },

  setChips(db, user, value) {
    // console.log(`Chips: ${this.getChips(db, user)}\nValue: ${value}`)
    let update = this.getChips(db, user) + value;
    // console.log(`Update: ${update}`);
    db.run(
      `UPDATE profiles SET chips='${update}' WHERE name='${user}';`,
      (err) => {
        if (err) {
          return console.log(err.message);
        }
      }
    )
  },

  profileExists(db, user) {
    let valid = false;
    db.get(
      `SELECT name FROM profiles WHERE name='${user}';`,
      (err, name) => {
        if (err) {
          console.log(err.message);
        }
        console.log(name)
        if (name !== undefined) {
          console.log('yeet')
          valid = true;
        }
      }
    )
    console.log(`UHHH: ${valid}`)
    return valid;
  }
};