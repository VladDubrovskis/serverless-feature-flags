jest.mock('../src/lib/handler');
jest.mock('../src/lib/storage');
const handler = require('../src/lib/handler');
const storage = require('../src/lib/storage');
const post = require('../src/api/post.js');

describe('Feature flags POST endpoint', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should use generic handler and pass the storage.put as method', () => {
        const callback = jest.fn();
        handler.execute.mockReturnValue(Promise.resolve('test'));
        const context = { context: 1 };
        const event = {};
        return post.handler(event, context, callback).then(() => {
            expect(handler.execute).toHaveBeenCalledWith(storage.put, event, context, expect.any(Number), expect.any(Object));
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(null, 'test');
        });
    });

});
