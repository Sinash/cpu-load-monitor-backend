// Importing configuration settings, including thresholds for high load and recovery
import { config } from '../config';
// Importing a utility function to normalize CPU load data
import { getNormalizedCpuLoad } from '../utils/normalizeCpuLoad';

interface LoadData {
  loadAverage: number;
  timestamp: string;
}

interface Alert {
  startTime: string;
  endTime?: string;
}

const loadHistory: LoadData[] = [];
const highLoadAlerts: Alert[] = [];
const recoveryAlerts: Alert[] = [];

/**
 * Function to get the current CPU load data and handle alerting logic.
 *
 * This function retrieves normalized CPU load, stores it in the history,
 * checks for high load or recovery conditions, and triggers corresponding alerts.
 *
 * @returns {Promise<{ loadAverage: number, isHighLoad: boolean, isRecovery: boolean, timestamp: string }>}
 *          CPU load data, high load and recovery statuses, and timestamp.
 */
const getCPULoadData = async () => {
  const loadAverage = getNormalizedCpuLoad();
  const timestamp = new Date().toISOString();

  // Add new CPU load data to the history array
  loadHistory.push({ loadAverage, timestamp });

  // Clean out old load history that is older than 10 minutes
  cleanOldHistory();

  // Check if the current load exceeds the high load threshold
  const isHighLoad = loadAverage > config.HIGH_LOAD_THRESHOLD;
  // Check if the current load falls below the recovery threshold
  const isRecovery = loadAverage < config.RECOVERY_THRESHOLD;

  // Handle high load or recovery alert scenarios
  if (isHighLoad) {
    handleHighLoadAlert(timestamp);
  } else if (isRecovery) {
    handleRecoveryAlert(timestamp);
  }

  // Return CPU load data and alert statuses
  return { loadAverage, isHighLoad, isRecovery, timestamp };
};

/**
 * Function to handle high load alert.
 *
 * If no active high load alert exists, it starts a new one.
 * If a recovery alert is active, it closes it.
 *
 * @param {string} timestamp - The timestamp when the high load alert started.
 */
const handleHighLoadAlert = (timestamp: string) => {
  if (
    !highLoadAlerts.length ||
    highLoadAlerts[highLoadAlerts.length - 1].endTime
  ) {
    highLoadAlerts.push({ startTime: timestamp });
  } else {
    if (
      recoveryAlerts.length &&
      !recoveryAlerts[recoveryAlerts.length - 1].endTime
    ) {
      recoveryAlerts[recoveryAlerts.length - 1].endTime = timestamp;
    }
  }
};

/**
 * Function to handle recovery alert.
 *
 * If no active recovery alert exists, it starts a new one.
 * If a high load alert is active, it closes it.
 *
 * @param {string} timestamp - The timestamp when the recovery alert started.
 */
const handleRecoveryAlert = (timestamp: string) => {
  if (
    !recoveryAlerts.length ||
    recoveryAlerts[recoveryAlerts.length - 1].endTime
  ) {
    recoveryAlerts.push({ startTime: timestamp });
  } else {
    if (
      highLoadAlerts.length &&
      !highLoadAlerts[highLoadAlerts.length - 1].endTime
    ) {
      highLoadAlerts[highLoadAlerts.length - 1].endTime = timestamp;
    }
  }
};

/**
 * Function to retrieve the history of CPU load data.
 *
 * @returns {LoadData[]} An array of CPU load data with timestamps.
 */
const getLoadHistory = () => {
  return loadHistory;
};

/**
 * Function to retrieve the current alerts (high load and recovery).
 *
 * @returns {{ highLoadAlerts: Alert[], recoveryAlerts: Alert[] }} An object containing both high load and recovery alerts.
 */
const getAlerts = () => ({
  highLoadAlerts,
  recoveryAlerts,
});

/**
 * Function to remove CPU load history entries older than 10 minutes.
 *
 * This function maintains the load history within a 10-minute window by
 * removing entries that are older than the specified time.
 */
const cleanOldHistory = () => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  while (
    loadHistory.length &&
    new Date(loadHistory[0].timestamp).getTime() < tenMinutesAgo
  ) {
    loadHistory.shift();
  }
};

// Exporting the functions to be used in other parts of the application
export default { getCPULoadData, getLoadHistory, getAlerts };
