import express from 'express';
import request from 'supertest';
import { getCpuLoad } from '../../controllers/cpuLoadController'; // Import the router you want to test
import router from '../cpuLoadRoute';

// Mock the controller function
jest.mock('../../controllers/cpuLoadController');

const app = express();
app.use(express.json()); // Use express JSON middleware
app.use(router); // Use the router we are testing

describe('GET /cpu-load', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    jest.clearAllMocks();
  });

  it('should call the getCpuLoad controller when GET /cpu-load is hit', async () => {
    // Mock the controller function to simulate a successful response
    (getCpuLoad as jest.Mock).mockImplementation((req, res) => {
      res
        .status(200)
        .json({ message: 'Current CPU load retrieved successfully' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load');

    // Assert that the controller was called
    expect(getCpuLoad).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Current CPU load retrieved successfully'
    );
  });

  it('should return 500 if the getCpuLoad controller encounters an error', async () => {
    // Mock the controller function to simulate an error
    (getCpuLoad as jest.Mock).mockImplementation((req, res) => {
      res.status(500).json({ error: 'Internal server error' });
    });

    // Send a GET request to the route
    const response = await request(app).get('/cpu-load');

    // Assert that the controller was called
    expect(getCpuLoad).toHaveBeenCalled();

    // Assert the response status and body
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
