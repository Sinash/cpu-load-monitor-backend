import express from 'express';
import request from 'supertest';
import { getCpuAlerts } from '../../controllers/cpuAlertsController';
import router from '../cpuLoadAlertsRoute'; // Import the router you want to test

// Mock the controller function
jest.mock('../../controllers/cpuAlertsController');

const app = express();
app.use(express.json()); // Use express JSON middleware
app.use(router); // Use the router we are testing

describe('GET /cpu-load-alerts', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    jest.clearAllMocks();
  });

  it('should call the getCpuAlerts controller when GET /cpu-load-alerts is hit', async () => {
    // Mock the controller function to simulate a successful response
    (getCpuAlerts as jest.Mock).mockImplementation((req, res) => {
      res
        .status(200)
        .json({ message: 'CPU load alerts retrieved successfully' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load-alerts');

    // Assert that the controller was called
    expect(getCpuAlerts).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'CPU load alerts retrieved successfully'
    );
  });

  it('should return 500 if the getCpuAlerts controller encounters an error', async () => {
    // Mock the controller function to simulate an error
    (getCpuAlerts as jest.Mock).mockImplementation((req, res) => {
      res.status(500).json({ error: 'Internal server error' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load-alerts');

    // Assert that the controller was called
    expect(getCpuAlerts).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
