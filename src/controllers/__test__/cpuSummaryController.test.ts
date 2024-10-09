import { Request, Response } from 'express';
import cpuService from '../../services/cpuService'; // Import the CPU service
import { logger } from '../../utils/logger'; // Import the logger
import { getCpuSummary } from '../cpuSummaryController'; // Import the controller

// Mock the cpuService and logger
jest.mock('../../services/cpuService');
jest.mock('../../utils/logger');

describe('getCpuSummary Controller', () => {
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

  it('should return CPU load summary data successfully', async () => {
    // Mock the CPU service functions to return some data
    const mockCurrentLoad = { loadAverage: 0.7 };
    const mockLoadHistory = [
      { loadAverage: 0.5, timestamp: '2023-01-01T00:00:00Z' },
    ];
    const mockAlerts = [
      { alertType: 'High Load', timestamp: '2023-01-01T00:05:00Z' },
    ];

    (cpuService.getCPULoadData as jest.Mock).mockResolvedValue(mockCurrentLoad);
    (cpuService.getLoadHistory as jest.Mock).mockResolvedValue(mockLoadHistory);
    (cpuService.getAlerts as jest.Mock).mockResolvedValue(mockAlerts);

    // Call the controller
    await getCpuSummary(req as Request, res as Response);

    // Expect the service functions to have been called
    expect(cpuService.getCPULoadData).toHaveBeenCalled();
    expect(cpuService.getLoadHistory).toHaveBeenCalled();
    expect(cpuService.getAlerts).toHaveBeenCalled();

    // Expect the response to have been sent with the correct data
    expect(res.json).toHaveBeenCalledWith({
      currentLoad: mockCurrentLoad,
      history: mockLoadHistory,
      alerts: mockAlerts,
    });
  });

  it('should log an error and return 500 when an error occurs', async () => {
    // Mock cpuService.getCPULoadData to throw an error
    const mockError = new Error('Something went wrong');
    (cpuService.getCPULoadData as jest.Mock).mockRejectedValue(mockError);
    (cpuService.getLoadHistory as jest.Mock).mockResolvedValue([]);
    (cpuService.getAlerts as jest.Mock).mockResolvedValue([]);

    // Call the controller
    await getCpuSummary(req as Request, res as Response);

    // Expect the service function to have thrown an error
    expect(cpuService.getCPULoadData).toHaveBeenCalled();

    // Expect the logger to have been called with the error message
    expect(logger).toHaveBeenCalledWith(
      `Error retrieving CPU summary: ${mockError.message}`
    );

    // Expect the response to have been sent with status 500 and the error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to get CPU summary data',
    });
  });

  it('should log a generic error and return 500 when an unknown error occurs', async () => {
    // Mock cpuService.getCPULoadData to throw a non-error object
    const mockError = 'Non-error object';
    (cpuService.getCPULoadData as jest.Mock).mockRejectedValue(mockError);
    (cpuService.getLoadHistory as jest.Mock).mockResolvedValue([]);
    (cpuService.getAlerts as jest.Mock).mockResolvedValue([]);

    // Call the controller
    await getCpuSummary(req as Request, res as Response);

    // Expect the service function to have thrown an unknown error
    expect(cpuService.getCPULoadData).toHaveBeenCalled();

    // Expect the logger to have been called with a generic error message
    expect(logger).toHaveBeenCalledWith(
      'An unknown error occurred while retrieving CPU summary.'
    );

    // Expect the response to have been sent with status 500 and the error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to get CPU summary data',
    });
  });
});
