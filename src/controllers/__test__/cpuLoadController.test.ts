import { Request, Response } from 'express';
import { getCpuLoad } from '../../controllers/cpuLoadController'; // Import the controller
import cpuService from '../../services/cpuService'; // Import the CPU service
import { logger } from '../../utils/logger'; // Import the logger

// Mock the cpuService and logger
jest.mock('../../services/cpuService');
jest.mock('../../utils/logger');

describe('getCpuLoad Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Mock request and response objects
    req = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      json: jsonMock,
      status: statusMock,
    };

    jest.clearAllMocks(); // Clear all previous mock calls
  });

  it('should return current CPU load data successfully', async () => {
    // Mock the cpuService.getCPULoadData() to return some data
    const mockData = { loadAverage: 1.2, timestamp: '2023-01-01T00:00:00Z' };
    (cpuService.getCPULoadData as jest.Mock).mockResolvedValue(mockData);

    // Call the controller
    await getCpuLoad(req as Request, res as Response);

    // Expect the service to have been called
    expect(cpuService.getCPULoadData).toHaveBeenCalled();

    // Expect the response to have been sent with the correct data
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should log an error and return 500 when an error occurs', async () => {
    // Mock cpuService.getCPULoadData() to throw an error
    const mockError = new Error('Something went wrong');
    (cpuService.getCPULoadData as jest.Mock).mockRejectedValue(mockError);

    // Call the controller
    await getCpuLoad(req as Request, res as Response);

    // Expect the service to have been called and thrown an error
    expect(cpuService.getCPULoadData).toHaveBeenCalled();

    // Expect the logger to have been called with the error message
    expect(logger).toHaveBeenCalledWith(
      `Error retrieving CPU alerts: ${mockError.message}`
    );

    // Expect the response to have been sent with status 500 and the error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to get CPU load data',
    });
  });

  it('should log a generic error and return 500 when an unknown error occurs', async () => {
    // Mock cpuService.getCPULoadData() to throw a non-error object
    const mockError = 'Non-error object';
    (cpuService.getCPULoadData as jest.Mock).mockRejectedValue(mockError);

    // Call the controller
    await getCpuLoad(req as Request, res as Response);

    // Expect the service to have been called and thrown a non-error object
    expect(cpuService.getCPULoadData).toHaveBeenCalled();

    // Expect the logger to have been called with a generic error message
    expect(logger).toHaveBeenCalledWith(
      'An unknown error occurred while retrieving CPU alerts.'
    );

    // Expect the response to have been sent with status 500 and the error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to get CPU load data',
    });
  });
});
