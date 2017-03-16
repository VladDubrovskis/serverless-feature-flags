module.exports = function(payload) {
  return payload.reduce((transformed, value) => {
    transformed[value.featureName] = (value.state === "true" || value.state === true) ? true : false;
    return transformed;
  }, {});
}
