import express from 'express';
import request from 'supertest';
import { getCpuHistory } from '../../controllers/cpuHistoryController';
import router from '../cpuLoadHistoryRoute'; // Import the router you want to test

// Mock the controller function
jest.mock('../../controllers/cpuHistoryController');

const app = express();
app.use(express.json()); // Use express JSON middleware
app.use(router); // Use the router we are testing

describe('GET /cpu-load-history', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    jest.clearAllMocks();
  });

  it('should call the getCpuHistory controller when GET /cpu-load-history is hit', async () => {
    // Mock the controller function to simulate a successful response
    (getCpuHistory as jest.Mock).mockImplementation((req, res) => {
      res
        .status(200)
        .json({ message: 'CPU load history retrieved successfully' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load-history');

    // Assert that the controller was called
    expect(getCpuHistory).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'CPU load history retrieved successfully'
    );
  });

  it('should return 500 if the getCpuHistory controller encounters an error', async () => {
    // Mock the controller function to simulate an error
    (getCpuHistory as jest.Mock).mockImplementation((req, res) => {
      res.status(500).json({ error: 'Internal server error' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load-history');

    // Assert that the controller was called
    expect(getCpuHistory).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
