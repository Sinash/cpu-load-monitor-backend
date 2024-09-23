import request from 'supertest';
import app from '../app'; // Import the app instance

// Mock the logger to avoid console output during tests
jest.mock('../utils/logger');

describe('Express Application', () => {
  // Mock environment variables for valid username and password
  beforeEach(() => {
    process.env.USERNAME = 'testuser';
    process.env.PASSWORD = 'testpassword';
    jest.clearAllMocks();
  });

  it('should return 401 for unauthorized requests to /api routes', async () => {
    // Send a request to one of the /api routes without Basic Auth
    const response = await request(app).get('/api/v1/cpu-load');

    // Expect a 401 Unauthorized response
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      'Authorization header missing or malformed'
    );
  });

  it('should return CPU load on successful Basic Auth', async () => {
    // Provide valid Basic Auth credentials
    const response = await request(app)
      .get('/api/v1/cpu-load')
      .set(
        'Authorization',
        'Basic ' + Buffer.from('testuser:testpassword').toString('base64')
      );

    // Expect a 200 OK response (assuming the route works correctly)
    expect(response.status).toBe(200);

    // Verify the structure of the response (this might change based on implementation)
    expect(response.body).toHaveProperty('loadAverage'); // Assuming your API returns this
  });

  it('should return 404 for undefined routes', async () => {
    // Provide valid Basic Auth credentials to bypass the auth check
    const response = await request(app)
      .get('/api/v1/unknown-route')
      .set(
        'Authorization',
        'Basic ' + Buffer.from('testuser:testpassword').toString('base64')
      );

    // Expect a 404 Not Found response
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Route not found. Please check the URL.'
    );
  });
});
