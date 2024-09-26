// Importing Request and Response types from Express to define the request and response objects
import { Request, Response } from 'express';
// Importing the CPU service, which handles business logic related to CPU load and history
import cpuService from '../services/cpuService';
// Importing the logger utility for logging messages
import { logger } from '../utils/logger';

/**
 * Controller function to handle the GET request for retrieving both the current CPU load and history.
 *
 * This function asynchronously calls the CPU service to get the current CPU load and history,
 * then responds with both sets of data in JSON format.
 *
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 *
 * @returns {Promise<void>} Sends a JSON response containing both the current CPU load and history data or an error message
 */
export const getCpuSummery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch both the current CPU load and the load history in parallel
    const [currentLoadData, loadHistory, loadAlerts] = await Promise.all([
      cpuService.getCPULoadData(),
      cpuService.getLoadHistory(),
      cpuService.getAlerts(),
    ]);

    // Respond with both data sets in JSON format
    res.json({
      currentLoad: currentLoadData,
      history: loadHistory,
      alerts: loadAlerts,
    });
  } catch (error) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      // Log the error message using the logger utility
      logger(`Error retrieving CPU summary: ${error.message}`);
    } else {
      // Log a generic error message if the error is not an instance of Error
      logger('An unknown error occurred while retrieving CPU summary.');
    }

    // If an error occurs, respond with a 500 status code and an error message
    res.status(500).json({ error: 'Failed to get CPU summary data' });
  }
};
