module.exports = {
  transform: (payload) => {
    return payload.reduce((transformed, value) => {
      transformed[value.featureName] = (value.state === "true" || value.state === true) ? true : false;
      return transformed;
    }, {});
  }
}
