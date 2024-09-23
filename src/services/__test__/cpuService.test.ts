import cpuService from '../../services/cpuService';
import { getNormalizedCpuLoad } from '../../utils/normalizeCpuLoad';

// Mock the utility functions and config
jest.mock('../../utils/normalizeCpuLoad');
jest.mock('../../config', () => ({
  config: {
    HIGH_LOAD_THRESHOLD: 1.0,
    RECOVERY_THRESHOLD: 0.8,
  },
}));

describe('cpuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // Use fake timers to simulate time delays

    // Reset loadHistory array before each test
    const loadHistory = cpuService.getLoadHistory();
    while (loadHistory.length > 0) {
      loadHistory.pop();
    }
  });

  afterEach(() => {
    jest.useRealTimers(); // Return to real timers after each test
  });

  describe('getCPULoadData', () => {
    it('should trigger recovery alert when load falls below recovery threshold', async () => {
      // Step 1: Mock high load and call getCPULoadData to trigger high load alert
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(1.5);
      await cpuService.getCPULoadData();

      // Fast-forward time by 2 minutes to simulate high load alert trigger
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Call getCPULoadData again to ensure the high load alert is processed
      await cpuService.getCPULoadData();

      // Step 2: Mock load falling below recovery threshold and call getCPULoadData again
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(0.7);
      await cpuService.getCPULoadData();

      // Fast-forward time by 2 minutes to trigger recovery alert
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Call getCPULoadData again to ensure the recovery alert is processed
      await cpuService.getCPULoadData();

      // Verify recovery alert is triggered
      const alerts = cpuService.getAlerts();
      expect(alerts.recoveryAlerts.length).toBe(1);
      expect(alerts.recoveryCount).toBe(1);
    });
  });
});
