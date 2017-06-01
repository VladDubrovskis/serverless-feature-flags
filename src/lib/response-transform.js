module.exports = payload =>
    payload.reduce(
        (transformed, value) => Object.assign({}, transformed,
            { [value.featureName]: !!((value.state === 'true' || value.state === true)) },
            ),
        {});
