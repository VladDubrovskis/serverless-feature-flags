module.exports = {
  validate: (input) => {
    try {
      return JSON.parse(input);
    } catch (e) {
      return false;
    }
  },
};
