const isEmptyRequest = require('../src/lib/is-valid-request');

describe('Is empty request method', () => {
  it('should return true for JSON body', () => {
    const expected = { test: 1 };
    const actual = isEmptyRequest(JSON.stringify(expected));
    expect(actual).toEqual(expected);
  });

  it('should return false for JSON body', () => {
    expect(isEmptyRequest({ test: 1 })).toEqual(false);
  });

  it('should return false for empty string body', () => {
    expect(isEmptyRequest('')).toEqual(false);
  });

  it('should return false for undefined', () => {
    expect(isEmptyRequest()).toEqual(false);
  });

  it('should return false for empty object', () => {
    expect(isEmptyRequest({})).toEqual(false);
  });
});
