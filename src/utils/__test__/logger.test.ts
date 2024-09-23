import { logger } from '../logger'; // Import the logger function

describe('logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let dateNowSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console.log to mock its implementation
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Mock Date to return a consistent timestamp
    const mockDate = new Date('2024-09-23T02:07:40.980Z');
    dateNowSpy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    // Restore the original console.log and Date after each test
    consoleLogSpy.mockRestore();
    dateNowSpy.mockRestore();
  });

  it('should log a message with a timestamp and "[LOG]" prefix', () => {
    const testMessage = 'This is a test message';

    // Call the logger function
    logger(testMessage);

    // Verify that console.log was called with the correctly formatted message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `[LOG] - 2024-09-23T02:07:40.980Z: ${testMessage}`
    );
  });

  it('should call console.log once per log invocation', () => {
    const testMessage = 'Another test message';

    // Call the logger function
    logger(testMessage);

    // Verify that console.log was called exactly once
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});
