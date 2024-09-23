import os from 'os';
import { getNormalizedCpuLoad } from '../normalizeCpuLoad'; // Import the function

// Mock the `os` module's methods
jest.mock('os');

describe('getNormalizedCpuLoad', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return the normalized CPU load based on the number of CPU cores', () => {
    // Mock os.cpus() to return a certain number of CPU cores
    (os.cpus as jest.Mock).mockReturnValue([{}, {}, {}]); // Mock 3 CPUs

    // Mock os.loadavg() to return a specific 1-minute load average
    (os.loadavg as jest.Mock).mockReturnValue([1.5, 0.5, 0.3]); // 1.5 for the 1-minute load average

    // Call the function
    const normalizedLoad = getNormalizedCpuLoad();

    // Expect the normalized load to be calculated correctly
    // Normalized load = loadAverage (1.5) / numCpus (3) = 0.5
    expect(normalizedLoad).toBe(0.5);
  });

  it('should handle cases where loadavg returns 0 for the 1-minute load average', () => {
    // Mock os.cpus() to return 4 CPUs
    (os.cpus as jest.Mock).mockReturnValue([{}, {}, {}, {}]);

    // Mock os.loadavg() to return 0 for the 1-minute load average
    (os.loadavg as jest.Mock).mockReturnValue([0, 0, 0]);

    // Call the function
    const normalizedLoad = getNormalizedCpuLoad();

    // Expect the normalized load to be 0 (0 load divided by any number of CPUs should be 0)
    expect(normalizedLoad).toBe(0);
  });
});
