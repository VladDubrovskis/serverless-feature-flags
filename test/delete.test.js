jest.mock('../src/lib/handler');
jest.mock('../src/lib/storage');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');
const deleteHandler = require('../src/api/delete.js');

describe('Feature flags DELETE endpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use generic handler and pass the storage.delete as method', () => {
    const callback = jest.fn();
    handler.mockReturnValue(Promise.resolve('test'));
    const context = { context: 1 };
    const event = {};
    return deleteHandler.handler(event, context, callback).then(() => {
      expect(handler)
          .toHaveBeenCalledWith(
              storage.delete,
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
