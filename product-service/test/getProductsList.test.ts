import * as Handler from '../src/functions/getProductsList/handler';

describe('Test getProductById', () => {
    test('should return 200 status code', async () => {
        const result = await Handler.getProductsList();
        expect(result.statusCode).toBe(200);
    });
});
