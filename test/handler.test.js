jest.mock('../src/lib/is-valid-request');
jest.mock('../src/lib/response-transform');

const isValidRequest = require('../src/lib/is-valid-request');
const responseTransform = require('../src/lib/response-transform');
const handler = require('../src/lib/handler.js');

describe('Lambda handler', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with a 204 on successful call by default if no success status code has been passed', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve());
    const payload = { featureName: 1, state: 2 };
    isValidRequest.validate.mockReturnValue(payload);
    return handler.execute(method, payload, undefined, 204).then((result) => {
      expect(result.statusCode).toEqual(204);
      expect(method).toHaveBeenCalledWith(payload);
    });
  });

  it('should resolve with a 203 on successful call', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve());
    isValidRequest.validate.mockReturnValue(true);
    return handler.execute(method, {}, undefined, 203).then((result) => {
      expect(result.statusCode).toEqual(203);
    });
  });

  it('should resolve with any code passed on successful call', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve());
    isValidRequest.validate.mockReturnValue(true);
    return handler.execute(method, {}, undefined, 301).then((result) => {
      expect(result.statusCode).toEqual(301);
    });
  });

  it('should resolve with a 500 on failed call', () => {
    const method = jest.fn().mockReturnValue(Promise.reject());
    isValidRequest.validate.mockReturnValue(true);
    return handler.execute(method, {}).catch((error) => {
      expect(error.statusCode).toEqual(500);
    });
  });

  it('should support error response mapping. e.g. 400 to 404', () => {
    const method = jest.fn().mockReturnValue(Promise.reject({ statusCode: 400 }));
    isValidRequest.validate.mockReturnValue(true);
    return handler.execute(method, {}, undefined, 204, { 400: 404 }).catch((error) => {
      expect(error.statusCode).toEqual(404);
    });
  });

  it('should not run the payload validation on GET request', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve({ Items: {} }));
    isValidRequest.validate.mockReturnValue(false);
    responseTransform.transform.mockReturnValue({});
    return handler.execute(method, { httpMethod: 'GET' }).then((result) => {
      expect(result.statusCode).toEqual(204);
      expect(isValidRequest.validate).toHaveBeenCalledTimes(0);
    });
  });

  it('should run the payload validation on other http requests', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve());
    isValidRequest.validate.mockReturnValue(true);
    return handler.execute(method, { httpMethod: 'ANY' }).then((result) => {
      expect(result.statusCode).toEqual(204);
      expect(isValidRequest.validate).toHaveBeenCalledTimes(1);
    });
  });

  it('should return 400 when the payload is invalid on other requests', () => {
    const method = jest.fn();
    isValidRequest.validate.mockReturnValue(false);
    return handler.execute(method, {}).catch((error) => {
      expect(error.statusCode).toEqual(400);
      expect(method).toHaveBeenCalledTimes(0);
      expect(error.body).toEqual({
        error: {
          code: 400,
          message: 'Invalid request',
        },
      });
    });
  });

  it('should run the response transform on the GET request', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve({ Items: {} }));
    isValidRequest.validate.mockReturnValue(true);
    responseTransform.transform.mockReturnValue({});
    return handler.execute(method, { httpMethod: 'GET' }, undefined, 200).then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(responseTransform.transform).toHaveBeenCalledTimes(1);
    });
  });

  it('should not run the response transform on the non-GET requests', () => {
    const method = jest.fn().mockReturnValue(Promise.resolve());
    isValidRequest.validate.mockReturnValue(true);
    responseTransform.transform.mockReturnValue({});
    return handler.execute(method, { httpMethod: 'ANY' }, undefined, 200).then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(responseTransform.transform).toHaveBeenCalledTimes(0);
    });
  });
});
