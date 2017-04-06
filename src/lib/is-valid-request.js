module.exports = {
  validate: (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  }
}
