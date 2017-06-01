module.exports = (input) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    return false;
  }
};
