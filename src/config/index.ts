// Importing the 'dotenv' package to load environment variables from a .env file into process.env
import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();

// Exporting a config object that contains application configuration settings
export const config = {
  // Define the PORT for the server to run on, defaulting to 3000 if not set in the environment variables
  PORT: process.env.PORT || 3001,

  // Set a threshold for high CPU load, which could trigger alerts
  HIGH_LOAD_THRESHOLD: 1,

  // Set a threshold for CPU load recovery, when the system is considered to have recovered from high load
  RECOVERY_THRESHOLD: 1,

  // Minutes to hold the hsitorical data
  HISTORY_TIME_IN_MIN: 10,

  // Minutes in HIGH_LOAD_THRESHOLD to trigger Hight Load Alert
  MINS_IN_HIGH_THRESHOLD: 2,

  // Minutes in RECOVERy_THRESHOLD to trigger Recovery Alert
  MINS_IN_RECOVERY_THRESHOLD: 2,
};
