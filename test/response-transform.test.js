const responseTransform = require('../src/lib/response-transform');

describe('Response transform', () => {
  it('should return the transformed payload that looks like the expected schema', () => {
    const payload = [
      {
        featureName: 'test2',
        state: 'true',
      },
      {
        featureName: 'test',
        state: 'false',
      },
    ];

    const actual = responseTransform.transform(payload);

    const expected = {
      test2: true,
      test: false,
    };

    expect(actual).toEqual(expected);
  });
});
