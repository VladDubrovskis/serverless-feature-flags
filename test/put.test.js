jest.mock('../src/lib/handler');
jest.mock('../src/lib/storage');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');
const put = require('../src/api/put.js');

describe('Feature flags PUT endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use generic handler and pass the storage.update as method', () => {
    const callback = jest.fn();
    handler.mockReturnValue(Promise.resolve('test'));
    const context = { context: 1 };
    const event = {};
    return put.handler(event, context, callback).then(() => {
      expect(handler)
          .toHaveBeenCalledWith(
            storage.update,
            event,
            context,
            expect.any(Number),
            expect.any(Object),
          );
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(null, 'test');
    });
  });
});
