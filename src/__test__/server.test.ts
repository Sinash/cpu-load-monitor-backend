import { Server } from 'http'; // Import Server to return in the mock
import app from '../app'; // Import the Express app instance
import { config } from '../config'; // Import the configuration settings
import { logger } from '../utils/logger'; // Import the logger utility

// Mock the logger utility to avoid real console output
jest.mock('../utils/logger');

describe('Server Initialization', () => {
  let listenMock: jest.SpyInstance;

  beforeEach(() => {
    // Mock the app.listen method to return a mock Server object instead of Express app
    listenMock = jest
      .spyOn(app, 'listen')
      .mockImplementation((port, callback) => {
        if (callback) callback(); // Call the callback immediately
        return new Server(); // Return a mock Server object instead of Express app
      });
  });

  afterEach(() => {
    // Restore the original behavior of the mocked functions
    listenMock.mockRestore();
  });

  it('should start the server on the configured port', () => {
    // Call the part of the code that starts the server
    require('../server'); // This simulates running the server entry point

    // Expect the app.listen function to have been called with the configured port
    expect(listenMock).toHaveBeenCalledWith(config.PORT, expect.any(Function));

    // Expect the logger to have been called with the correct message
    expect(logger).toHaveBeenCalledWith(
      `Server started on port ${config.PORT}`
    );
  });
});
