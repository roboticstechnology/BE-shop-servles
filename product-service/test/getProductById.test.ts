import * as Handler from '../src/functions/getProductById/handler';

describe('Test getProductById', () => {
    test('should return 200 status code', async () => {
        const result = await Handler.getProductById({ pathParameters: { id: '1' } });
        console.log(result);
        expect(result.statusCode).toBe(200);
    });

    test('should return 404 status code', async () => {
        const result = await Handler.getProductById({ pathParameters: { id: '10' } });
        console.log(result);
        expect(result.statusCode).toBe(404);
    });
});
