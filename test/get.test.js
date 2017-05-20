jest.mock('../src/lib/handler');
jest.mock('../src/lib/storage');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');
const get = require('../src/api/get.js');

describe('Feature flags GET endpoint', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use generic handler and pass the storage.put as method', () => {
    const callback = jest.fn();
    handler.execute.mockReturnValue(Promise.resolve('test'));
    const context = { context: 1 };
    const event = {};
    return get.handler(event, context, callback).then(() => {
      expect(handler.execute).toHaveBeenCalledWith(storage.get, event, context, 200);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, 'test');
    });
  });

});
