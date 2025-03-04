import request from 'supertest';
import app from '../../src/app';

describe('Smoke Test for Route', () => {
    it('should respond with a 200 status code', async () => {
        const response = await request(app).get('/user?registered=false');
        expect(response.status).toBe(200);
    });
});