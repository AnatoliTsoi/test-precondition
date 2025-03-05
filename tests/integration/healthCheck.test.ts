import request from 'supertest';
import app from '../../src/app';

describe('Health Check test', () => {
    it('/health returns 200', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe("Health check passed");
    });
});