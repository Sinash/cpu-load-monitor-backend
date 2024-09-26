// Importing the Express framework to create a router instance
import express from 'express';
// Importing the getCpuSummary controller function to handle requests for the CPU summary
import { getCpuSummary } from '../controllers/cpuSummaryController';

// Creating a new router instance from Express
const router = express.Router();

// Define a route for GET requests to '/cpu-summary' that will invoke the getCpuSummary controller
router.get('/cpu-summary', getCpuSummary);

// Export the router so it can be used in other parts of the application
export default router;
