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

let highLoadCount = 0; // Number of times CPU went into high load
let recoveryCount = 0; // Number of times CPU recovered from high load

let highLoadStartTime: number | null = null; // Timestamp when high load started
let recoveryStartTime: number | null = null; // Timestamp when recovery started
let inHighLoad = false; // Flag to indicate if system is currently in high load
let inRecovery = false; // Flag to indicate if system is currently in recovery

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
  const isLoadAboveThreshold = loadAverage > config.HIGH_LOAD_THRESHOLD;

  // Check if the current load falls below the recovery threshold
  const isLoadBelowThreshold = loadAverage < config.RECOVERY_THRESHOLD;

  let isHighLoad = false;
  let isRecovery = false;

  // Handle high load or recovery alert scenarios with a 2-minute delay for each
  if (isLoadAboveThreshold && !inHighLoad) {
    handlePotentialHighLoad(timestamp);
  } else if (isLoadBelowThreshold && highLoadStartTime && !inRecovery) {
    // Only trigger recovery if it is in a high load state and hasn't recovered yet
    handleRecovery(timestamp);
  }

  // If the system is currently in high load, set the isHighLoad flag to true
  if (inHighLoad) {
    isHighLoad = true;
  }

  // If the system is currently in recovery, set the isRecovery flag to true
  if (inRecovery) {
    isRecovery = true;
    // Reset inHighLoad when recovery is completed to ensure isHighLoad becomes false
    inHighLoad = false;
  }

  // Return CPU load data and alert statuses
  return { loadAverage, isHighLoad, isRecovery, timestamp };
};

/**
 * Function to handle potential high load alert with a 2-minute threshold.
 *
 * @param {string} timestamp - The timestamp when the load crossed the high load threshold.
 */
const handlePotentialHighLoad = (timestamp: string) => {
  const currentTime = new Date(timestamp).getTime();

  if (!highLoadStartTime) {
    highLoadStartTime = currentTime; // Set the start time when the load first goes above the threshold
    return;
  }

  if (
    highLoadAlerts.length &&
    !highLoadAlerts[highLoadAlerts.length - 1].endTime
  ) {
    return;
  }

  // Check if high load has persisted for more than 2 minutes
  if (currentTime - highLoadStartTime >= 2 * 60 * 1000) {
    // Only trigger a high load alert if it has persisted for 2 minutes
    inHighLoad = true;
    highLoadAlerts.push({
      startTime: new Date(highLoadStartTime).toISOString(),
    });
    highLoadCount++; // Increment the high load count
    recoveryStartTime = null; // Reset recovery timer if it was running
    inRecovery = false;
  }
};

/**
 * Function to handle recovery alert with a 2-minute threshold.
 *
 * @param {string} timestamp - The timestamp when recovery was detected.
 */
const handleRecovery = (timestamp: string) => {
  const currentTime = new Date(timestamp).getTime();

  if (!recoveryStartTime) {
    recoveryStartTime = currentTime;
    return;
  }

  if (
    recoveryAlerts.length &&
    !recoveryAlerts[recoveryAlerts.length - 1].endTime
  ) {
    return;
  }

  // Check if recovery has persisted for more than 2 minutes
  if (currentTime - recoveryStartTime >= 2 * 60 * 1000) {
    if (
      !recoveryAlerts.length ||
      recoveryAlerts[recoveryAlerts.length - 1].endTime
    ) {
      // Ensure the recovery starts right after the high load ends
      const twoMinBeforeRecovery = new Date(currentTime - 2 * 60 * 1000);

      // Set recovery start time to match the end of the last high load alert
      recoveryAlerts.push({
        startTime: new Date(twoMinBeforeRecovery).toISOString(), // Fallback to timestamp if undefined
        endTime: new Date(currentTime).toISOString(), // Set recovery end time 2 minutes after it starts
      });

      if (
        highLoadAlerts.length &&
        !highLoadAlerts[highLoadAlerts.length - 1].endTime
      ) {
        // Set highLoadAlerts endTime when the load goes below the threshold
        highLoadAlerts[highLoadAlerts.length - 1].endTime = new Date(
          twoMinBeforeRecovery
        ).toISOString();
      }

      recoveryCount++; // Increment the recovery count
      highLoadStartTime = null; // Reset high load timer if it was running
      inRecovery = true; // Set recovery flag to true to avoid multiple recovery alerts
      inHighLoad = false; // Reset the high load flag when recovery is completed
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
 * @returns {{ highLoadAlerts: Alert[], recoveryAlerts: Alert[], highLoadCount: number, recoveryCount: number }}
 *          An object containing both high load and recovery alerts along with their counts.
 */
const getAlerts = () => ({
  highLoadAlerts,
  recoveryAlerts,
  highLoadCount,
  recoveryCount,
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
