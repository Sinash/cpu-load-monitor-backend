import { Request, Response } from 'express';
import { errorHandler } from '../errorMiddleware'; // Import the error handler

describe('errorHandler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    // Mock the Request and Response objects
    req = {};
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });

    res = {
      status: statusMock,
    };

    // Mock console.error to spy on its calls
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original console.error after each test
    consoleErrorMock.mockRestore();
  });

  it('should log the error and return 500 with a generic error message', () => {
    // Create a mock error
    const mockError = new Error('Test error message');

    // Call the errorHandler middleware
    errorHandler(mockError, req as Request, res as Response);

    // Check that console.error was called with the error stack
    expect(consoleErrorMock).toHaveBeenCalledWith(mockError.stack);

    // Check that the response status was set to 500
    expect(res.status).toHaveBeenCalledWith(500);

    // Check that the response sent a generic error message
    expect(sendMock).toHaveBeenCalledWith({ error: 'Something went wrong!' });
  });
});
