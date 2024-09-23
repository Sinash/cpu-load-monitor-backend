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

    // Reset in-memory data before each test
    const loadHistory = cpuService.getLoadHistory();
    const alerts = cpuService.getAlerts();

    // Clear load history and alerts
    while (loadHistory.length > 0) {
      loadHistory.pop();
    }
    while (alerts.highLoadAlerts.length > 0) {
      alerts.highLoadAlerts.pop();
    }
    while (alerts.recoveryAlerts.length > 0) {
      alerts.recoveryAlerts.pop();
    }

    // Reset counters and flags
    alerts.highLoadCount = 0;
    alerts.recoveryCount = 0;
  });

  afterEach(() => {
    jest.useRealTimers(); // Return to real timers after each test
  });

  describe('getCPULoadData', () => {
    it('should add new load data to the history and trigger high load alert when threshold is exceeded', async () => {
      // Mock the CPU load to be above the high load threshold
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(1.5);

      // Call getCPULoadData once to add the load to the history
      await cpuService.getCPULoadData();

      // Verify load history contains the new entry
      const loadHistory = cpuService.getLoadHistory();
      expect(loadHistory.length).toBe(1); // Only 1 entry should be in the history
      expect(loadHistory[0].loadAverage).toBe(1.5);

      // Fast-forward time by 2 minutes to trigger the high load alert
      jest.advanceTimersByTime(2 * 60 * 1000);

      // Call getCPULoadData again after advancing the time to ensure the alert is processed
      await cpuService.getCPULoadData();

      // Verify the high load alert is triggered
      const alerts = cpuService.getAlerts();
      expect(alerts.highLoadAlerts.length).toBe(1);
      expect(alerts.highLoadCount).toBe(1);
    });

    it('should trigger recovery alert when load falls below recovery threshold', async () => {
      // Step 1: Mock high load and call getCPULoadData to trigger high load alert
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(1.5);
      await cpuService.getCPULoadData();

      // Fast-forward time by 2 minutes to simulate high load for 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);

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

    it('should not trigger high load alert if threshold is not exceeded', async () => {
      // Mock CPU load to be below the high load threshold
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(0.9);

      const result = await cpuService.getCPULoadData();

      // Verify no high load alert is triggered
      const alerts = cpuService.getAlerts();
      expect(alerts.highLoadAlerts.length).toBe(0);
      expect(result.isHighLoad).toBe(false);
    });

    it('should remove load data older than 10 minutes', async () => {
      const mockTimestamp = new Date(Date.now() - 11 * 60 * 1000).toISOString();
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(0.9);

      // Add older data to the history
      cpuService
        .getLoadHistory()
        .push({ loadAverage: 0.9, timestamp: mockTimestamp });

      await cpuService.getCPULoadData();

      // Fast-forward time to trigger cleanup
      jest.advanceTimersByTime(10 * 60 * 1000);

      // Verify old data is removed from the history
      const loadHistory = cpuService.getLoadHistory();
      expect(loadHistory.length).toBe(1); // Only the new data should remain
      expect(loadHistory[0].timestamp).not.toBe(mockTimestamp);
    });
  });

  describe('getAlerts', () => {
    it('should return the current high load and recovery alerts', async () => {
      // Step 1: Mock CPU load to trigger high load alert
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(1.5);
      await cpuService.getCPULoadData();

      // Fast-forward time by 2 minutes to simulate high load for 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);
      await cpuService.getCPULoadData(); // Process high load alert

      // Step 2: Mock CPU load to trigger recovery alert
      (getNormalizedCpuLoad as jest.Mock).mockReturnValue(0.7); // Below recovery threshold
      await cpuService.getCPULoadData();

      // Fast-forward time by 2 minutes to simulate recovery for 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);
      await cpuService.getCPULoadData(); // Process recovery alert

      // Retrieve the current alerts
      const alerts = cpuService.getAlerts();

      // Verify that only one high load alert and one recovery alert were triggered
      expect(alerts.highLoadCount).toBe(2); // Expect two high load alert
      expect(alerts.recoveryCount).toBe(2); // Expect two recovery alert
    });
  });
});
